import { model, Schema } from "mongoose";

const walletSchema = Schema({
    userId          : { type : Schema.Types.ObjectId, index : true},
    previousAmount  : { type : Number, index: true },
    amount          : { type : Number, index: true },
    type            : { type : String, index: true },
    transactionId   : { type : String, index: true, default: '' },
    status          : { type : String, index: true },
    remarks         : { type : String, index: true, default: '' },
    addedBy         : { type : String, index: true },
    isActive        : { type : Boolean, default: true },
},{timestamps:true});


export default model('wallet', walletSchema); 