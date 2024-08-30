import express from "express";
import morgan from "morgan";
import { body, validationResult } from "express-validator";
export const userRoute = express.Router();
export const userAuthRoute = express.Router();

/***************************
        CUSTOM IMPORTS
****************************/
import User from "../models/User.js";
import { logout, userLogin } from "../controllers/user/authController.js";
import { userValidation } from "../validation/userValidation.js";
import { userMenusList } from "../controllers/user/menuController.js";
import {
  changePassword,
  getDailyReport,
  getProfile,
  myOrders,
  profileUpdate,
  updateSettings,
  userDetails,
  userNotification,
} from "../controllers/user/userProfileController.js";
import { userTransactionList } from "../controllers/user/transactionController.js";
import {
  backBet,
  betHistory,
  layBet,
  matchBetHistory,
} from "../controllers/user/betController.js";
/* Middleware For Creating Console Log of Routes*/
userAuthRoute.use(morgan("dev"));
userRoute.use(morgan("dev"));

/****************************
  REGISTER & LOGIN ROUTES
****************************/

userRoute.post(
  "/login",
  [
    body("email", "Email field is Required").notEmpty().isEmail(),
    body("password", "Password field is Required").notEmpty(),
  ],
  userValidation,
  userLogin
);

/****************************
  USER AUTHENTICATED ROUTES 
****************************/

/* MENU ROUTES START */

userAuthRoute.get("/menus-list", userMenusList);

/* MENU ROUTES END */

/* PROFILE ROUTES START */

userAuthRoute.put(
  "/profile",
  [
    body("firstName", "firstName field is required").notEmpty(),
    body("lastName", "lastName field is required").notEmpty(),
  ],
  userValidation,
  profileUpdate
);

// By New
userAuthRoute.get("/get-profile", getProfile);

userAuthRoute.post(
  "/change-password",
  [
    body("currentPassword", "currentPassword field is required").notEmpty(),
    body("newPassword", "newPassword field is required").notEmpty(),
  ],
  userValidation,
  changePassword
);

userAuthRoute.post(
  "/update-settings",
  [body("lotSize", "type field is required!!").notEmpty()],
  userValidation,
  updateSettings
);

userAuthRoute.get("/user-details", userDetails);
userAuthRoute.get("/user-notification", userNotification);
userAuthRoute.post("/my-orders", myOrders);

/* PROFILE ROUTES END */

/* DAILY REPORT  ROUTES START HERE */
userAuthRoute.post(
  "/get-daily-report",
  [
    body("fromDate", "fromDate field is required!").notEmpty(),
    body("toDate", "toDate field is required!").notEmpty(),
  ],
  userValidation,
  getDailyReport
);

userAuthRoute.get("/get-transaction", userTransactionList);
/* DAILY REPORT  ROUTES END HERE */

/* LAY BACK ROUTES START HERE */
userAuthRoute.post(
  "/lay-bet",
  [
    body("stack")
      .notEmpty()
      .withMessage("stack field is mandatory")
      .isInt({ min: 100 })
      .withMessage("minimum stack value is 100 rs"),
    body("team")
      .notEmpty()
      .withMessage("team field is mandatory"),
    body("matchId").notEmpty().withMessage("matchId field is mandatory"),
    body("oddType")
      .notEmpty()
      .withMessage("oddType field is mandatory")
      .isIn(["matchodds", "bookmaker", "tiedmatch"])
      .withMessage(
        "team value can either 'matchodds','tiedmatch' or 'bookmaker'"
      ),
  ],
  userValidation,
  layBet
);

userAuthRoute.post(
  "/back-bet",
  [
    body("stack")
      .notEmpty()
      .withMessage("stack field is mandatory")
      .isInt({ min: 100 })
      .withMessage("minimum stack value is 100 rs"),
    body("team")
      .notEmpty()
      .withMessage("team field is mandatory"),
    body("matchId").notEmpty().withMessage("matchId field is mandatory"),
    body("oddType")
      .notEmpty()
      .withMessage("oddType field is mandatory")
      .isIn(["matchodds", "bookmaker", "tiedmatch"])
      .withMessage(
        "team value can either 'matchodds','tiedmatch' or 'bookmaker'"
      ),
  ],
  userValidation,
  backBet
);

userAuthRoute.get("/match-bet-history", matchBetHistory);

userAuthRoute.post(
  "/bet-history",
  [body("matchId").notEmpty().withMessage("matchId field is mandatory")],
  userValidation,
  betHistory
);

/* LAY BACK ROUTES END HERE */

/* LOGOUT ROUTE START */

userAuthRoute.get("/logout", logout);

/* LOGOUT ROUTE END */
