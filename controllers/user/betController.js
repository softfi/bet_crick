import {
  authValues,
  responseWithData,
  responseWithoutData,
} from "../../helpers/helper.js";
import Wallet from "../../models/Wallet.js";
import axios from "axios";
import BetsDetails from "../../models/BetsDetails.js";

// export const layBet = async (req, res) => {
//   let customer = await authValues(req.headers["authorization"]);
//   if (!customer) {
//     return responseWithoutData(
//       res,
//       201,
//       false,
//       "Invalid User or session is invalid!"
//     );
//   }
//   const { stack, team, matchId, oddType } = req?.body;
//   const userWallet = await Wallet.findOne({ userId: customer?._id });
//   const remaingWallatAmount = await userWallet?.amount;
//   if (Number(stack) > Number(remaingWallatAmount)) {
//     return responseWithoutData(res, 400, false, "Insufficient Balance");
//   }

//   // const apiUrl = `https://rest.entitysport.com/exchange/matches/${matchId}/odds?token=${TOKEN}`;
//   const apiUrl = `https://rest.entitysport.com/exchange/matches/${matchId}/odds?token=${TOKEN}`;
//   const response = await axios.get(apiUrl);

//   if(!response || response.data.status !== "ok"){
//     return responseWithoutData(res, 404, false, "Service expire");
//   }
//   const matchData = response?.data?.response;

//   // console.log(matchData);
//   // const matchInfo = await Match_Info.findOne({ match_id: Number(matchId) });
//   // let matchInfo = await readFile("data/odds.json", "utf-8");
//   // matchInfo = JSON.parse(matchInfo)?.response;

//   // const liveOdds = matchInfo?.live_odds;
//   const liveOdds = matchData?.live_odds;
//   const matchOdd = liveOdds?.matchodds;
//   const bookmakerOdd = liveOdds?.bookmaker;
//   const tiedMatchOdd = liveOdds?.tiedmatch;

//   let currentLayOdd;
//   if (oddType == "matchodds") {
//     if (team == "teama") {
//       currentLayOdd = matchOdd?.teama?.lay;
//     } else if (team == "teamb") {
//       currentLayOdd = matchOdd?.teamb?.lay;
//     } else {
//       return responseWithoutData(res, 404, false, "Invalid Team Type");
//     }
//   } else if (oddType == "bookmaker") {
//     if (team == "teama") {
//       currentLayOdd = bookmakerOdd?.teama?.lay;
//     } else if (team == "teamb") {
//       currentLayOdd = bookmakerOdd?.teamb?.lay;
//     } else {
//       return responseWithoutData(res, 404, false, "Invalid Team Type");
//     }
//   } else if (oddType == "tiedmatch") {
//     if (team == "teama") {
//       currentLayOdd = tiedMatchOdd?.teama?.lay;
//     } else if (team == "teamb") {
//       currentLayOdd = tiedMatchOdd?.teamb?.lay;
//     } else {
//       return responseWithoutData(res, 404, false, "Invalid Odd Type");
//     }
//   }

//   let teamAAmount, teamBAmount;

//   if (team == "teama") {
//     teamAAmount = -(stack * (2 - currentLayOdd));
//     teamBAmount = stack;
//   } else if (team == "teamb") {
//     teamAAmount = stack;
//     teamBAmount = stack * currentLayOdd;
//   } else {
//     return responseWithoutData(res, 404, false, "Invalid Team Type");
//   }

//   return responseWithoutData(res, 200, true, "Nothing to do");
// };

export const layBet = async (req, res) => {
  let customer = await authValues(req.headers["authorization"]);
  if (!customer) {
    return responseWithoutData(
      res,
      201,
      false,
      "Invalid User or session is invalid!"
    );
  }

  const { stack, team, matchId, oddType } = req?.body;
  const userWallet = await Wallet.findOne({ userId: customer?._id });
  const remaingWallatAmount = await userWallet?.amount;
  if (Number(stack) > Number(remaingWallatAmount)) {
    return responseWithoutData(res, 400, false, "Insufficient Balance");
  }

  const apiUrl = `https://20xpro.com:5000/api/data/match-api/odd/${matchId}`;

  const response = await axios.get(apiUrl);

  if (!response || !response?.data?.status) {
    return responseWithoutData(res, 404, false, "Service expire");
  }
  const matchData = response?.data?.data[0];
  let live_odds = matchData?.runners;

  let teamIdx = live_odds.findIndex(
    (e) => e.selectionId.toString() === team.toString()
  );

  if(teamIdx < 0){
    return responseWithoutData(res, 400, false, "Invalid team selection!");
  }

  let teamA_amount = 0;
  let teamB_amount = 0;

  let oddTeam = null;
  if (teamIdx === 0) {
    oddTeam = live_odds[0].back[0];
    teamB_amount = stack;
  } else if (teamIdx === 1) {
    oddTeam = live_odds[1].back[0];
    teamA_amount = stack;
  }

  if (!oddTeam) {
    return responseWithoutData(res, 400, false, "Invalid oddTeam selection!");
  }

  let oddsPoint = Number(oddTeam?.price);

  if (!oddsPoint) {
    return responseWithoutData(res, 400, false, "No lay odds available!");
  }

  if (teamIdx === 0) {
    teamA_amount = -((stack * oddsPoint) - stack);
  } else if (teamIdx === 1) {
    teamB_amount = -((stack * oddsPoint) - stack);
  }
  
  let betInfo = await BetsDetails.findOne({
    userId: customer._id,
    matchId: matchId,
  }).lean();

  if (!betInfo) {
    betInfo = await BetsDetails.create({
      matchId: matchId,
      exposure: 0,
      userId: customer._id,
      bettingData: [],
    });
  }

  let betData = {
    dateTime: new Date(),
    team: team,
    amount: stack,
    teamA_amount: teamA_amount,
    teamB_amount: teamB_amount,
    betType: "lay",
    betValue: oddsPoint,
  };

  delete betInfo.bettingData;

  await BetsDetails.updateOne(
    {
      userId: customer._id,
      matchId: matchId,
    },
    {
      $push: {
        bettingData: betData,
      },
    }
  );

  const pipeline = [
    { $unwind: "$bettingData" },
    {
      $group: {
        _id: null,
        exposure: { $first: "$exposure" },
        totalTeamA_Amount: { $sum: "$bettingData.teamA_amount" },
        totalTeamB_Amount: { $sum: "$bettingData.teamB_amount" },
      },
    },
  ];

  let exposureValue = 0;
  let exposure = await BetsDetails.aggregate(pipeline);
console.log(exposure);

  if (exposure && exposure.length > 0) {
    let totalAmount = exposure[0];
    if (   
      totalAmount?.totalTeamA_Amount > 0 &&
      totalAmount?.totalTeamB_Amount > 0
    ) {
      exposureValue = 0;
    } else if (
      totalAmount?.totalTeamA_Amount < 0 &&
      totalAmount?.totalTeamB_Amount < 0
    ) {
      exposureValue =
        totalAmount?.totalTeamA_Amount > totalAmount?.totalTeamB_Amount
          ? totalAmount?.totalTeamB_Amount
          : totalAmount?.totalTeamA_Amount;
    } else if (
      totalAmount?.totalTeamA_Amount > 0 &&
      totalAmount?.totalTeamB_Amount < 0
    ) {
      exposureValue = totalAmount?.totalTeamB_Amount;
    } else if (
      totalAmount?.totalTeamA_Amount < 0 &&
      totalAmount?.totalTeamB_Amount > 0
    ) {
      exposureValue = totalAmount?.totalTeamA_Amount;
    }
  }

  await BetsDetails.updateOne(
    {
      userId: customer._id,
      matchId: matchId,
    },
    {
      $set: {
        exposure: exposureValue,
      },
    }
  );

  betInfo.exposure = exposureValue;

  return responseWithData(res, 200, true, "Bet confirmed", betInfo);
};

export const backBet = async (req, res) => {
  let customer = await authValues(req.headers["authorization"]);
  if (!customer) {
    return responseWithoutData(
      res,
      201,
      false,
      "Invalid User or session is invalid!"
    );
  }

  const { stack, team, matchId, oddType } = req?.body;
  const userWallet = await Wallet.findOne({ userId: customer?._id });
  const remaingWallatAmount = await userWallet?.amount;
  if (Number(stack) > Number(remaingWallatAmount)) {
    return responseWithoutData(res, 400, false, "Insufficient Balance");
  }

  const apiUrl = `https://20xpro.com:5000/api/data/match-api/odd/${matchId}`;

  const response = await axios.get(apiUrl);

  if (!response || !response?.data?.status) {
    return responseWithoutData(res, 404, false, "Service expire");
  }
  const matchData = response?.data?.data[0];
  let live_odds = matchData?.runners;

  let teamIdx = live_odds.findIndex(
    (e) => e.selectionId.toString() === team.toString()
  );

  if(teamIdx < 0){
    return responseWithoutData(res, 400, false, "Invalid team selection!");
  }

  let teamA_amount = 0;
  let teamB_amount = 0;

  let oddTeam = null;
  if (teamIdx === 0) {
    oddTeam = live_odds[0].lay[0];
    teamB_amount = -stack;
  } else if (teamIdx === 1) {
    oddTeam = live_odds[1].lay[0];
    teamA_amount = -stack;
  }

  if (!oddTeam) {
    return responseWithoutData(res, 400, false, "Invalid oddTeam selection!");
  }

  let oddsPoint = Number(oddTeam?.price);

  if (!oddsPoint) {
    return responseWithoutData(res, 400, false, "No back odds available!");
  }

  if (teamIdx === 0) {
    teamA_amount = (stack * oddsPoint) - stack;
  } else if (teamIdx === 1) {
    teamB_amount = (stack * oddsPoint) - stack;
  }

  let betInfo = await BetsDetails.findOne({
    userId: customer._id,
    matchId: matchId,
  }).lean();

  if (!betInfo) {
    betInfo = await BetsDetails.create({
      matchId: matchId,
      exposure: 0,
      userId: customer._id,
      bettingData: [],
    });
  }

  let betData = {
    dateTime: new Date(),
    team: team,
    amount: stack,
    teamA_amount: teamA_amount,
    teamB_amount: teamB_amount,
    betType: "back",
    betValue: oddsPoint,
  };

  delete betInfo.bettingData;

  await BetsDetails.updateOne(
    {
      userId: customer._id,
      matchId: matchId,
    },
    {
      $push: {
        bettingData: betData,
      },
    }
  );

  const pipeline = [
    { $unwind: "$bettingData" },
    {
      $group: {
        _id: null,
        exposure: { $first: "$exposure" },
        totalTeamA_Amount: { $sum: "$bettingData.teamA_amount" },
        totalTeamB_Amount: { $sum: "$bettingData.teamB_amount" },
      },
    },
  ];

  let exposureValue = 0;
  let exposure = await BetsDetails.aggregate(pipeline);

  // console.log("exposured you");
  // console.log(exposure);
  

  if (exposure && exposure.length > 0) {
    let totalAmount = exposure[0];
    if (
      totalAmount?.totalTeamA_Amount > 0 &&
      totalAmount?.totalTeamB_Amount > 0
    ) {
      exposureValue = 0;
    } else if (
      totalAmount?.totalTeamA_Amount < 0 &&
      totalAmount?.totalTeamB_Amount < 0
    ) {
      exposureValue =
        totalAmount?.totalTeamA_Amount > totalAmount?.totalTeamB_Amount
          ? totalAmount?.totalTeamB_Amount
          : totalAmount?.totalTeamA_Amount;
    } else if (
      totalAmount?.totalTeamA_Amount > 0 &&
      totalAmount?.totalTeamB_Amount < 0
    ) {
      exposureValue = totalAmount?.totalTeamB_Amount;
    } else if (
      totalAmount?.totalTeamA_Amount < 0 &&
      totalAmount?.totalTeamB_Amount > 0
    ) {
      exposureValue = totalAmount?.totalTeamA_Amount;
    }
  }

  await BetsDetails.updateOne(
    {
      userId: customer._id,
      matchId: matchId,
    },
    {
      $set: {
        exposure: exposureValue,
      },
    }
  );

  betInfo.exposure = exposureValue;

  return responseWithData(res, 200, true, "Bet confirmed", betInfo);
};

export const matchBetHistory = async (req, res) => {
  let customer = await authValues(req.headers["authorization"]);
  if (!customer) {
    return responseWithoutData(
      res,
      401,
      false,
      "Invalid User or session is invalid!"
    );
  }

  let betInfo = await BetsDetails.find({ userId: customer._id }).lean();

  return responseWithData(
    res,
    200,
    true,
    "Bet history fetched successfully1",
    betInfo
  );
};

export const betHistory = async (req, res) => {
  let customer = await authValues(req.headers["authorization"]);
  if (!customer) {
    return responseWithoutData(
      res,
      401,
      false,
      "Invalid User or session is invalid!"
    );
  }

  const { matchId } = req?.body;

  const pipeline = [
    {
      $match: {
        userId: customer._id,
        matchId,
      },
    },
    {
      $addFields: {
        bettingData: {
          $sortArray: {
            input: "$bettingData",
            sortBy: { dateTime: -1 },
          },
        },
      },
    },
  ];
  let betInfo = await BetsDetails.aggregate(pipeline);
  
  if (!betInfo || betInfo.length === 0) {
    return responseWithoutData(res, 400, false, "Invalid match id");
  }

  let betList = betInfo[0]?.bettingData;

  return responseWithData(res, 200, true, "Bet history fetched successfully", {
    exposure: betInfo[0]?.exposure,
    betList,
  });
};

// export const backBet = async (req, res) => {
//   let customer = await authValues(req.headers["authorization"]);
//   if (!customer) {
//     return responseWithoutData(
//       res,
//       201,
//       false,
//       "Invalid User or session is invalid!"
//     );
//   }
//   const { stack, team, matchId, oddType } = req?.body;
//   const userWallet = await Wallet.findOne({ userId: customer?._id });
//   const remaingWallatAmount = await userWallet?.amount;
//   if (Number(stack) > Number(remaingWallatAmount)) {
//     return responseWithoutData(res, 400, false, "Insufficient Balance");
//   }
//   const matchInfo = await Match_Info.findOne({ match_id: Number(matchId) });
//   const liveOdds = matchInfo?.live_odds;
//   const matchOdd = liveOdds?.matchodds;
//   const bookmakerOdd = liveOdds?.bookmaker;
//   const tiedMatchOdd = liveOdds?.tiedmatch;
//   let currentBackOdd;
//   if (oddType == "matchodds") {
//     if (team == "teama") {
//       currentBackOdd = matchOdd?.teama?.back;
//     } else if (team == "teamb") {
//       currentBackOdd = matchOdd?.teamb?.back;
//     } else {
//       return responseWithoutData(res, 404, false, "Invalid Team Type");
//     }
//   } else if (oddType == "bookmaker") {
//     if (team == "teama") {
//       currentBackOdd = bookmakerOdd?.teama?.back;
//     } else if (team == "teamb") {
//       currentBackOdd = bookmakerOdd?.teamb?.back;
//     } else {
//       return responseWithoutData(res, 404, false, "Invalid Team Type");
//     }
//   } else if (oddType == "tiedmatch") {
//     if (team == "teama") {
//       currentBackOdd = tiedMatchOdd?.teama?.back;
//     } else if (team == "teamb") {
//       currentBackOdd = tiedMatchOdd?.teamb?.back;
//     } else {
//       return responseWithoutData(res, 404, false, "Invalid Odd Type");
//     }
//   }
//   let teamAAmount, teamBAmount;

//   if (team == "teama") {
//     teamAAmount = stack * currentBackOdd;
//     teamBAmount = -stack;
//   } else if (team == "teamb") {
//     teamAAmount = -stack;
//     teamBAmount = stack * currentBackOdd;
//   } else {
//     return responseWithoutData(res, 404, false, "Invalid Team Type");
//   }
// };
