import { model, Schema } from "mongoose";

const userSchema = Schema({
    name            : { type:String, index: true},
    email           : { type: String, index: true },
    pan             : { type: String, index: true },
    aadhar          : { type: String, index: true },
    mobile          : { type: Number, index: true },
    image           : { type: String, default:null, index: true},
    role            : { type: String, index: true},
    password        : { type: String },
    dob             : { type: String ,index: true},
    walletBalance   : { type: Number, index: true, default:0 },
    emailOtp        : { type: Number },
    isEmailVerify   : { type: Boolean, default: false },     
    mobileOtp       : { type: Number },
    isMobileVerify  : { type: Boolean, default: false },
    isActive        : { type:Boolean, default: true },
    isDeleted       : { type:Boolean, default: false },
},{timestamps:true});


export default model('user', userSchema); 