import { model, Schema } from "mongoose";

const roleSchema = Schema({
    name        : { type : String , required: true, index : true },
    addedBy     : { type : Schema.Types.ObjectId, index : true, default:null},
    isActive      : { type : Boolean , default:true },
    isDeleted    : { type : Boolean , default:false},
}, {timestamps: true})

export default model('role', roleSchema);