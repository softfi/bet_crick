import { model, Schema } from "mongoose";

const UserSetting = Schema({
    userId          : { type : Schema.Types.ObjectId, index : true},
    lotSize         : { type : Number, index : true}, 
    isActive        : { type : Boolean, default: true },
},{timestamps:true});


export default model('user_settings', UserSetting); 