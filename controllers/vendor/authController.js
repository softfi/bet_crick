import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { errorResponse, getJwtToken, responseWithData } from "../../helpers/helper.js";
import { errorLog } from "../../config/logger.js";

export const vendorLogin = async (req, res) => {
    try {
        let vendor = await User.findOne({ email: req.body.email, isDeleted:false });

        if (vendor) {
            let comparePassword = await bcrypt.compare(req.body.password, vendor.password);
            if (comparePassword) {
                return responseWithData(res,200,true,"Vendor Logged In Successfully",{...vendor._doc,token:getJwtToken(vendor._id)});
            } else {
                res.status(403).send({
                    status: false,
                    msg: "Invalid Credentials",
                });
            }
        } else {
            // No user found with the provided email, send an "Invalid Credentials" error response
            res.status(403).send({
                status: false,
                msg: "Invalid Credentials",
            });
        }
    } catch (error) {
        errorLog(error)
        errorResponse(res);
    }
}