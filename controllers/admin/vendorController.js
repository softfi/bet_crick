import { errorLog } from "../../config/logger.js";
import bcrypt from "bcrypt";
import { errorResponse, getImageSingedUrlById, responseWithData, responseWithoutData } from "../../helpers/helper.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";

export const createVendor = async (req, res) => {
    try {
        let dataSave = await User.create({
            ...req?.body,
            password: await bcrypt.hash(req.body.password, 10),
            role: '656858d8c7c96b70a05f883d'
        });
        if (dataSave) {
            return responseWithoutData(res, 200, true, "Vendor has been added Successfully!!");
        } else {
            return responseWithoutData(res, 201, false, "Something Went Wrong!!");
        }
    } catch (error) {
        errorLog(error);
        return errorResponse(res);
    }
}


export const listVendor = async (req, res) => {
    try {
        let datas = await User.find({ isDeleted: false, role: "656858d8c7c96b70a05f883d" });
        let lists = [];
        for (let data of datas) {
            lists.push({
                ...data._doc,
                image: (data.image) ? await getImageSingedUrlById(data.image) : ''
            });
        }
        if (lists.length > 0) {
            return responseWithData(res, 200, true, "Vendor List get Successfully", lists);
        } else {
            return responseWithoutData(res, 201, false, "No Record Found");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}