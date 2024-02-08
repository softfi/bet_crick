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
import { getDailyReport, myOrders, profileUpdate, updateSettings, userDetails, userNotification } from "../controllers/user/userProfileController.js";
/* Middleware For Creating Console Log of Routes*/
userAuthRoute.use(morgan('dev'));
userRoute.use(morgan('dev'));

/****************************
  REGISTER & LOGIN ROUTES
****************************/

userRoute.post('/login', [
  body('email', 'Email field is Required').notEmpty().isEmail(),
  body('password', 'Password field is Required').notEmpty()
], userValidation, userLogin);




/****************************
  USER AUTHENTICATED ROUTES 
****************************/

/* MENU ROUTES START */

userAuthRoute.get('/menus-list', userMenusList);

/* MENU ROUTES END */


/* PROFILE ROUTES START */

userAuthRoute.put('/profile',[
  body('firstName', 'firstName field is required').notEmpty(),
  body('lastName', 'lastName field is required').notEmpty(),
],userValidation, profileUpdate); 
 

userAuthRoute.post('/update-settings',[
  body('lotSize', 'type field is required!!').notEmpty(),
],userValidation, updateSettings);  

userAuthRoute.get('/user-details', userDetails); 
userAuthRoute.get('/user-notification', userNotification); 
userAuthRoute.post('/my-orders', myOrders); 


/* PROFILE ROUTES END */


/* DAILY REPORT  ROUTES START HERE */
userAuthRoute.post(
'/get-daily-report',
[
  body('fromDate', 'fromDate field is required!').notEmpty(),
  body('toDate', 'toDate field is required!').notEmpty(),
], userValidation,getDailyReport);
/* DAILY REPORT  ROUTES END HERE */

/* LOGOUT ROUTE START */

userAuthRoute.get('/logout', logout);

/* LOGOUT ROUTE END */
