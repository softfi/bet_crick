import { errorLog } from "../../config/logger.js";
import { errorResponse, responseWithData, responseWithoutData } from "../../helpers/helper.js";
import Match_List from "../../models/MatchList.js";
import Match_Info from "../../models/MatchInfo.js";

export const listMatches = async (req, res) => {
    try {
        
        let data = await Match_List.find({});

        if (data.length > 0) {
            return responseWithData(res, 200, true, "Match List get Successfully", data);
        } else {
            return responseWithoutData(res, 201, true, "No Record Found");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const getMatchInfo = async (req, res) => {
    try {
        let matchId = req?.params?.matchId || "";

        if (!matchId) {
            return responseWithoutData(res, 400, false, "No match id provided");
        }

        let data = await Match_Info.findOne({ match_id: matchId });

        if (data) {
            return responseWithData(res, 200, true, "Match Data fetched successfully!", data);
        } else {
            return responseWithoutData(res, 400, false, "Invalid match id");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}