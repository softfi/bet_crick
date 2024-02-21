import { errorLog } from "../../config/logger.js"
import { authValues, errorResponse, getUserSettings, responseWithData, responseWithoutData } from "../../helpers/helper.js";
import ActivityLog from "../../models/ActivityLog.js";
import Notification from "../../models/Notification.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import UserSetting from "../../models/UserSetting.js";
import bcrypt from "bcrypt";

export const profileUpdate = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }
        const { firstName, lastName } = req?.body;
        let updateStatus = await User.findByIdAndUpdate(customer?._id, { $set: { firstName: firstName, lastName: lastName } });
        if (updateStatus) {
            return responseWithData(res, 200, true, "Profile has been updated Successfully", { ...updateStatus._doc, firstName: firstName, lastName: lastName });
        } else {
            return responseWithoutData(res, 201, false, "Some Went Wrong, Please try again later!");
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

// By new start

export const getProfile = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }

        let userDetails = "";
        try {
            userDetails = await User.findById(req.body.id);
        } catch (err) {
            return responseWithoutData(res, 401, false, "Invalid user id");
        }

        userDetails.password = "";
        return responseWithData(res, 200, true, "User Details get Successfully!!", userDetails);
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const changePassword = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }

        let getUser = await User.findOne({_id:customer._id,isDeleted:false});
        console.log(getUser.password);
        console.log(req.body.currentPassword);
        let comparePassword = await bcrypt.compare(req.body.currentPassword, getUser.password);
        console.log("----------------------------");
        console.log(comparePassword);

        if (comparePassword) {
            const hashedPassword = await bcrypt.hash(req?.body?.newPassword, 10);
            let updateStatus = await User.findByIdAndUpdate(customer?._id, { $set: { password: hashedPassword } });

            if (updateStatus) {
                return responseWithoutData(res, 200, true, "Profile password changed successfully");
            } else {
                return responseWithoutData(res, 201, false, "Some Went Wrong, Please try again later!");
            }
        } else {
            return responseWithoutData(res, 400, false, "Please enter your current password correctly");
        }

    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

// By new end

export const updateButtonSettings = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }
        const { type, recordType } = req?.body;
        let recordingSataus = (recordType == 1) ? true : false;
        if (type == 'recording') {
            if (customer?.isRecording == recordingSataus) {
                return responseWithoutData(res, 201, false, `Recording is already ${recordingSataus == true ? 'Running' : 'Stop'}`);
            }
            await User.findByIdAndUpdate(customer?._id, { isRecording: recordingSataus });
        } else if (type == 'play') {
            if (customer?.isPlay == recordingSataus) {
                return responseWithoutData(res, 201, false, `Play is already ${recordingSataus == true ? 'Running' : 'Stop'}`);
            }
            await User.findByIdAndUpdate(customer?._id, { isPlay: recordingSataus });
        }
        if (recordingSataus == true) {
            await ActivityLog.create({
                userId: customer?._id,
                type: type,
                startTimestamp: new Date()
            });
            return responseWithoutData(res, 200, true, `${type} Started Successfully!`);
        } else {
            let getActivityLog = await ActivityLog.findOne({ userId: customer?._id, type: type }).sort({ createdAt: -1 });
            if (getActivityLog) {
                await ActivityLog.findByIdAndUpdate(getActivityLog._id, {
                    $set: {
                        endTimestamp: new Date()
                    }
                });
                return responseWithoutData(res, 200, true, `${type} Stop Successfully!`);
            } else {
                return responseWithoutData(res, 201, false, `No ${type} Event Running!`);
            }
        }
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const userDetails = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }
        return responseWithData(res, 200, true, "User Details get Successfully!!", { ...customer._doc, lotSize: await getUserSettings(customer?._id, 'lotSize') });
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const userNotification = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }
        let notification = await Notification.findOne({ userId: customer?._id, status: "pending" }).sort({ createdAt: 1 });
        if (notification == null) {
            return responseWithoutData(res, 201, false, "No Notification Found!");
        }
        await Notification.findByIdAndUpdate(notification?._id, { $set: { status: "success" } });
        return responseWithData(res, 200, true, "Notification Message Get Successfully", notification);
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}


export const updateSettings = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }
        const { lotSize } = req?.body;
        let checkUserSettings = await UserSetting.findOne({ userId: customer?._id });
        if (checkUserSettings) {
            await UserSetting.findByIdAndUpdate(checkUserSettings?._id, { $set: { lotSize: lotSize } });
        } else {
            await UserSetting.create({
                userId: customer?._id,
                lotSize: lotSize
            });
        }
        return responseWithoutData(res, 200, true, "Settings has been Updated Successfully!!");
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const myOrders = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }
        let query = {};
        if (req?.body?.transaction_type) {
            query = { ...query, transaction_type: (req?.body?.transaction_type?.toUpperCase()).trim() }
        }
        if (req?.body?.status) {
            query = { ...query, status: (req?.body?.status?.toUpperCase()).trim() }
        }
        let { fromDate, toDate } = req?.body;
        if (fromDate != '' && toDate != '') {
            query = { ...query, createdAt: { $gte: new Date((new Date(fromDate)).setHours(0, 0, 0)), $lte: new Date((new Date(toDate)).setHours(23, 59, 59)) } }
        }
        if (fromDate != '' && toDate == '') {
            query = { ...query, createdAt: { $gte: new Date((new Date(fromDate)).setHours(0, 0, 0)) } }
        }
        if (fromDate == '' && toDate != '') {
            query = { ...query, createdAt: { $lte: new Date((new Date(toDate)).setHours(23, 59, 59)) } }
        }
        // if (fromDate == '' && toDate == '') {
        //     query = { ...query, createdAt: { $gte: new Date((new Date()).setHours(0, 0, 0)), $lte: new Date((new Date()).setHours(23, 59, 59)) } }
        // }
        console.log(query);
        let orders = await Order.find({ userId: customer?._id, ...query }).sort({ createdAt: -1 });
        let totalCount = orders.length;
        if (orders.length == 0) {
            return responseWithoutData(res, 201, false, "No Orders Record Found!");
        }
        return responseWithData(res, 200, true, "Order List Get Successfully", { list: orders, totalCount: totalCount });
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}

export const getDailyReport = async (req, res) => {
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }
        let totalInvest = 0;
        let totalOutput = 0;
        let profitPercentage = 0;
        let { fromDate, toDate } = req?.body;
        let orders = await Order.find({ userId: customer?._id, transaction_type: "BUY", sellOrderId: { $ne: null }, status: "COMPLETE", createdAt: { $gte: new Date((new Date(fromDate)).setHours(0, 0, 0)), $lte: new Date((new Date(toDate)).setHours(23, 59, 59)) } });
        for (let order of orders) {
            let sellOrder = await Order.findOne({ userId: customer?._id, transaction_type: "SELL", _id: order?.sellOrderId, status: "COMPLETE", createdAt: { $gte: new Date((new Date(fromDate)).setHours(0, 0, 0)), $lte: new Date((new Date(toDate)).setHours(23, 59, 59)) } });
            if (sellOrder) {
                totalInvest += Number(order?.average_price) * Number(order?.quantity);
                totalOutput += Number(sellOrder?.average_price) * Number(sellOrder?.quantity);
            }
        }
        // totalInvest = 90;
        // totalOutput = 70;
        let totalProfit = Number(totalOutput) - Number(totalInvest);
        if (totalProfit) {
            profitPercentage = (Number(Number(totalProfit) * 100)) / Number(totalInvest);
            profitPercentage = Number(profitPercentage?.toFixed(2));
        }
        return responseWithData(res, 200, true, "Daily Report has been generated Successfully!!", { totalInvest, totalOutput, totalProfit, profitPercentage });
    } catch (error) {
        errorLog(error);
        errorResponse(res);
    }
}