import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { errorResponse, getJwtToken, responseWithData } from "../../helpers/helper.js";
import { errorLog } from "../../config/logger.js";

export const adminLogin = async (req, res) => {
    try {
        // Find a user with the provided email
        let admin = await User.findOne({ email: req.body.email, role: '6512c4c1185c0a6bf02b2c61' });

        if (admin) {
            // Compare the provided password with the stored hashed password
            let comparePassword = await bcrypt.compare(req.body.password, admin.password);

            if (comparePassword) {
                // Passwords match, send a success response with a JWT token
                return responseWithData(res,200,true,"Admin Logged In Successfully",{...admin._doc,token:getJwtToken(admin._id)});
            } else {
                // Passwords don't match, send an "Invalid Credentials" error response
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