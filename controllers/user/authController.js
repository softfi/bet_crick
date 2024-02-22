import { errorLog } from "../../config/logger.js";
import { destroyToken, errorResponse, getJwtToken, responseWithData, responseWithoutData } from "../../helpers/helper.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";

export const userLogin = async (req, res) => {
    try {
        let user = await User.findOne({ email: req?.body?.email, role: '6512c4c6185c0a6bf02b2c65',isDeleted:false });
        if (user) {
            let comparePassword = await bcrypt.compare(req?.body?.password, user?.password);
            if (comparePassword) {
                return responseWithData(res,200,true,"Admin Logged In Successfully",{...user._doc,token:getJwtToken(user?._id)});
            } else {
                return responseWithoutData(res,403,false,"Invalid Credentials!!");
            }
        } else {
            return responseWithoutData(res,403,false,"Invalid Credentials!!");
        }
    } catch (error) {
        errorLog(error)
        errorResponse(res);
    }
}

export const logout = async(req, res)=>{
    try {
        let destroyTokenData = await destroyToken(req.headers['authorization']);
        if(destroyTokenData){
            return responseWithoutData(res,200,true,"Logout Successfully!!");
        } else {
            return responseWithoutData(res,201,false,"Something Went Wrong!!");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}
