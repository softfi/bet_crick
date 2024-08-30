import { errorLog } from "../../config/logger.js";
import {
  responseWithoutData,
} from "../../helpers/helper.js";
import axios from "axios";

export const listMatches = async (req, res) => {
  try {
    // const apiUrl = `https://rest.entitysport.com/exchange/matches?token=${TOKEN}&status=${status}`;
    const apiUrl = `https://www.hattricks.games/chirag/getMatchs/4`;

    const data = await axios.get(apiUrl);
    return res.status(200).json(data?.data);
  } catch (error) {
    errorLog(error);
    return responseWithoutData(res, 500, false, "Error fetching match list");
  }
};

export const matchesOfApi = async (req, res) => {
  try {
    const { type, matchId } = req.params;

    let apiUrl = null;

    const types = {
      odd: `https://hattricks.games/chirag/getOdds/4/${matchId}`,
      bookmaker: `https://hattricks.games/chirag/getBookmakerOdds/4/${matchId}`,
      fancy: `https://hattricks.games/chirag/getSession/4/${matchId}`,
      score: `https://hattricks.games/chirag/getScore/4/${matchId}`,
      live_tv: `https://hattricks.games/chirag/cricket/_iframeHeight/${matchId}`,
    };

    if (type && types.hasOwnProperty(type)) {
      apiUrl = types[type];
    }

    if (!apiUrl) {
      return res.status(200).json({
        status: false,
        msg: `available endpoints are ${Object.keys(types).join(",")}`,
      });
    }

    const data = await axios.get(apiUrl);

    console.log("*-------------------------------*");
    console.log(data);
    console.log("*-------------------------------*");
    
    return res.status(200).json(data?.data);
  } catch (error) {
    errorLog(error);
    return responseWithoutData(res, 500, false, "Error fetching match list");
  }
};