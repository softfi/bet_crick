import { errorLog } from "../../config/logger.js";
import { authValues, responseWithoutData } from "../../helpers/helper.js";
import Wallet from "../../models/Wallet.js";

export const userTransactionList = async(req, res)=>{
    try {
        let customer = await authValues(req.headers['authorization']);
        if (!customer) {
            return responseWithoutData(res, 201, false, "Invalid User or session is invalid!");
        }

        let transactionList = await Wallet.find({ userId: customer._id }).select("-isActive -__v").populate([{path:'addedById',select:'name email type'},{path:'userId',select:'name email type'}]).lean();

        res.status(200).json({
            status: true,
            data: transactionList,
            msg: "Transaction list fetched successfully!",
        });
    } catch (error) {
        errorLog(error);
        res.status(500).send({ status: false, msg: "Something Went Wrong" });
    }
}