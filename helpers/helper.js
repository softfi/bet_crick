import jwt from "jsonwebtoken";
import { JWT_SECRET_TOKEN, JWT_EXPIRES_IN, mailer, EMAIL_FROM, S3, AWS_S3_BUCKET, EXPIRES_SINGNED_URL } from "../config/config.js";
import User from "../models/User.js";
import axios from "axios";
import Upload from "../models/Upload.js";
import Notification from "../models/Notification.js";
import UserSetting from "../models/UserSetting.js";

export const getJwtToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET_TOKEN, {
        expiresIn: JWT_EXPIRES_IN,
    });
} 

export const errorResponse = (res) => {
    res.status(500).send({ status: false, msg: "Something Went Wrong" });
}

export const authValues = async (authToken) => {
    let result = jwt.verify(authToken, JWT_SECRET_TOKEN);
    // console.log(result);
    // console.log("-------");
    let user = await User.findById(result.userId);
    return user;
}

export const isTokenVerified = (authToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(authToken, JWT_SECRET_TOKEN, async (err, result) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}



export const responseWithData = (res, code, status, message, data) => {
    res.status(code).send({ status: status, msg: message, data: data });
}

export const responseWithoutData = (res, code, status, message,) => {
    res.status(code).send({ status: status, msg: message, data: [] });
}

export const emailVerification = (to, subject, body) => {
    mailer.sendMail({
        from: EMAIL_FROM, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: body, // plain text body
        // html: "<b>Hello world?</b>", // html body
    });
}

export const sendMobileOtp = (mobile, otp) => {
    axios.get(`http://sms.softfix.in/submitsms.jsp?user=EsafeS&key=d5a7374c54XX&mobile=${mobile}&message=Dear%20User,%20Your%20OTP%20for%20login%20to%20Jio%20TrueConnect%20portal%20is%20Your%20SkinOCare%20OTP%20is%20${otp}%20.%20Valid%20for%2030%20minutes.%20Please%20do%20not%20share%20this%20OTP.%20Regards,%20Jio%20Trueconnect%20Team&senderid=DEALDA&accusage=1&entityid=1201159965850654415&tempid=1207167722926890489`).then((response) => {
        return true;
    }).catch((error) => {
        throw new Error(error);
    });
}

export const uploadToS3 = (fileName, filePath, fileData) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: AWS_S3_BUCKET,
            Key: filePath + '/' + fileName,
            Body: fileData,
        };
        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(data);
        });
    });
};

export const getImageSingedUrlById = async (uploadId) => {
    let uploadData = await Upload.findOne({ _id: uploadId });
    return await getSignUrl(uploadData?.filePath + '/' + uploadData?.fileName);
}

export const getSignedUrl = async (fileKey, callback) => {
    S3.getSignedUrl('getObject', {
        Bucket: AWS_S3_BUCKET,
        Key: fileKey,
        Expires: EXPIRES_SINGNED_URL,
    }, (err, url) => {
        if (!err) {
            callback(null, url); // Return the URL via the callback
        } else {
            callback(err); // Handle errors via the callback
        }
    });

}

export const getSignUrl = async (fileKey) => {
    let url = await S3.getSignedUrlPromise('getObject', {
        Bucket: AWS_S3_BUCKET,
        Key: fileKey,
        Expires: EXPIRES_SINGNED_URL,
    });
    return url;
}

export const destroyToken = async (authToken) => {
    // let result = await jwt.
    return result;
} 

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const currentTimeStamp = (timestamp) => {
    const currentDate = new Date(timestamp);
    const currentDayOfMonth = ((currentDate.getDate()) > 9 ? (currentDate.getDate()) : '0'+(currentDate.getDate()));
    const currentMonth = ((currentDate.getMonth()) > 9 ? (currentDate.getMonth()+1) : '0'+(currentDate.getMonth()+1)); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear(); 
    const dateString = currentYear + "-" + (currentMonth) + "-" + currentDayOfMonth;
    return dateString;
}

export const monthInString = async (monthNumber) => {
    const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return month[monthNumber]; 
}


export const saveNotification = async (params) => {
    return await Notification.create({...params});
}

export const getUserSettings = async (customerId,reqField) => {
    let userSettingsData = await UserSetting.findOne({userId:customerId});
    return (userSettingsData && userSettingsData?.[reqField] != undefined) ? userSettingsData?.[reqField] : '';
}





export const isCurrentTimeInRange = async (startHour, startMinute, endHour, endMinute) => {
    // Set the timezone to Indian Standard Time (IST)
    const timeZone = 'Asia/Kolkata';

    // Create a new Date object with the current time in the specified timezone
    const currentTime = new Date().toLocaleString('en-US', { timeZone });

    // Create start and end time objects
    const startTime = new Date(currentTime);
    const endTime = new Date(currentTime);

    // Set start time in 24-hour format
    startTime.setHours(startHour, startMinute, 0, 0);

    // Set end time in 24-hour format
    endTime.setHours(endHour, endMinute, 0, 0);

    return new Date(currentTime) > startTime && new Date(currentTime) < endTime;
}
