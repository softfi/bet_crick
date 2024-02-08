import { model, Schema } from "mongoose";
const ActivityLog = new Schema({
    userId                      :   { type : Schema.Types.ObjectId, index : true},
    type                        :   { type : String, index : true},
    startTimestamp              :   { type : String, index : true},
    endTimestamp                :   { type : String, index : true},
    status                      :   { type : String, index : true},
},{timestamps:true});


export default model('activity_logs', ActivityLog);