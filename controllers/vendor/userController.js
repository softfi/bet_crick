import { errorLog } from "../../config/logger.js";
import bcrypt from "bcrypt";
import { authValues, errorResponse, getImageSingedUrlById, responseWithData, responseWithoutData } from "../../helpers/helper.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";

export const createCustomer = async (req, res) => {
    try {
        let whoAmI = await authValues(req.headers['authorization']);

        let dataSave = await User.create({
            ...req?.body,
            password: await bcrypt.hash(req.body.password, 10),
            role: '6512c4c6185c0a6bf02b2c65',
            createdBy: whoAmI?.id,
            type: "customer"
        });
        if (dataSave) {
            return responseWithoutData(res, 200, true, "User has been added Successfully!!");
        } else {
            return responseWithoutData(res, 201, false, "Something Went Wrong!!");
        }
    } catch (error) {
        errorLog(error);
        return errorResponse(res);
    }
}

export const listCustomer = async (req, res) => {
    try {

        let whoAmI = await authValues(req.headers['authorization']);

        let datas = await User.find({ isDeleted: false, role: '6512c4c6185c0a6bf02b2c65', createdBy: whoAmI?.id }).select("-password");

        let lists = [];
        for (let data of datas) {
            lists.push({
                ...data._doc,
                image: (data.image) ? await getImageSingedUrlById(data.image) : ''
            });
        }
        if (lists.length > 0) {
            return responseWithData(res, 200, true, "User List get Successfully", lists);
        } else {
            return responseWithoutData(res, 201, false, "No Record Found");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const customerDetails = async (req, res) => {
    try {
        let whoAmI = await authValues(req.headers['authorization']);

        let userInfo = await User.findOne({ _id: req?.body?.id, role: "6512c4c6185c0a6bf02b2c65", createdBy: whoAmI.id, isDeleted: false }).select("-password");

        if (userInfo) {
            return responseWithData(res, 200, true, "User has been updated Successfully!!", userInfo);
        } else {
            return responseWithoutData(res, 401, false, "Invalid user Id!!");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const updateCustomer = async (req, res) => {
    try {
        let whoAmI = await authValues(req.headers['authorization']);

        const userInfo = await User.findOne({ _id: req?.body?.id, createdBy: whoAmI?.id, isDeleted: false });

        if (!userInfo) {
            return responseWithoutData(res, 201, false, "Invalid user Id!!");
        }
        let dataSave = await User.findByIdAndUpdate(req?.body?.id, {
            ...req?.body,
            password: userInfo.password,
            role: '6512c4c6185c0a6bf02b2c65'
        });
        if (dataSave) {
            return responseWithoutData(res, 200, true, "User has been updated Successfully!!");
        } else {
            return responseWithoutData(res, 201, false, "Something Went Wrong!!");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const deleteCustomer = async (req, res) => {
    try {
        let whoAmI = await authValues(req.headers['authorization']);
        let customerInfo = await User.findOne({ _id: req?.params?.id, role: "6512c4c6185c0a6bf02b2c65", createdBy: whoAmI._id, isDeleted: false });

        if (!customerInfo) {
            return responseWithoutData(res, 401, false, "Invalid user Id!!");
        }

        let dataSave = await User.findByIdAndUpdate(req?.params?.id, { isDeleted: true });
        if (dataSave) {
            return responseWithoutData(res, 200, true, "User has been deleted Successfully!!");
        } else {
            return responseWithoutData(res, 201, false, "Something Went Wrong!!");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const creditDebitCustomer = async (req, res) => {
    try {
        let whoAmI = await authValues(req.headers['authorization']);

        let checkUser = await User.findOne({ _id: req?.body?.userId, createdBy: whoAmI.id, isDeleted: false });

        if (!checkUser) {
            return responseWithoutData(res, 400, false, "Invalid user Id!!");
        }
        if ((checkUser?.walletBalance < req?.body?.amount) && req?.body?.type == 'debit') {
            return responseWithoutData(res, 201, false, "wallet Balance is lower than the request amount you want to debit!!");
        }

        let dataSave = await Wallet.create({
            userId: checkUser?._id,
            previousAmount: (checkUser?.walletBalance) ? checkUser?.walletBalance : 0,
            amount: req?.body?.amount,
            type: req?.body?.type,
            transactionId: req?.body?.transactionId,
            status: "success",
            remarks: req?.body?.remarks,
            addedBy: whoAmI.type,
            addedById: whoAmI.id,
        });

        if (dataSave) {
            if (dataSave?.type == 'credit') {
                await User.findByIdAndUpdate(checkUser?._id, { walletBalance: (Number(dataSave?.previousAmount) + Number(req?.body?.amount)) });
            } else {
                await User.findByIdAndUpdate(checkUser?._id, { walletBalance: (Number(dataSave?.previousAmount) - Number(req?.body?.amount)) });
            }
            return responseWithoutData(res, 200, true, `Amount has been ${dataSave?.type}ed to wallet!!`);
        } else {
            return responseWithoutData(res, 400, false, "Something Went Wrong!!");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const creditDebitListByVendor = async (req, res) => {
    try {
        // let roleFilter = req?.params?.roleId || "";
        // let roleName = await Role.findOne({id:roleFilter, isDeleted:false});

        // console.log(roleName)

        let whoAmI = await authValues(req.headers['authorization']);

        let datas = await Wallet.find({ isActive: true, addedById:whoAmI.id });
        let lists = [];
        for (let data of datas) {
            let userData = await User.findById(data?.userId);
            lists.push({
                ...data._doc,
                userName: userData?.name,
                userMobile: userData?.mobile,
                userEmail: userData?.email,
                roleType: userData?.type || "",
            });
        }
        if (lists.length > 0) {
            return responseWithData(res, 200, true, "Wallet history has been get Successfully", lists);
        } else {
            return responseWithoutData(res, 201, false, "No Record Found");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}