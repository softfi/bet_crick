import { validationResult } from "express-validator";
import { errorResponse, responseWithoutData } from "../helpers/helper.js";
import { errorLog } from "../config/logger.js";

export const vendorValiation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors?.array()[0]?.msg
        });
    }else{
        next();
    }    
}
