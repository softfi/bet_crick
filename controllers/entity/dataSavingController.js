import { errorLog } from "../../config/logger.js";
import Match_Info from "../../models/MatchInfo.js";
import Match_List from "../../models/MatchList.js";

export const insertMatchList = async (data) => {
    try {

        let dataSave = await Match_List.create({
            ...data
        });

        return true;
    } catch (error) {
        errorLog(error);
        return false
    }
}

export const insertMatchInfo = async (data) => {
    try {

        let dataSave = await Match_Info.create(data);

        return true;
    } catch (error) {
        errorLog(error);
        return false
    }
}