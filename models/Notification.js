import { model, Schema } from "mongoose";
const NotificationSchema = new Schema({
    userId      :   { type : Schema.Types.ObjectId ,index : true},
    title       :   { type : String ,index : true},
    message     :   { type : String ,index : true},
    status      :   { type : String ,index : true, default : 'pending'}
},{timestamps:true});


export default model('notifications', NotificationSchema);