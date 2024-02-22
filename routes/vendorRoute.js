import express from "express";
import { body } from "express-validator";
export const vendorAuthRoute = express.Router();

/***************************
        CUSTOM IMPORTS
 ****************************/
import { adminValiation, uploadImageValdator } from "../validation/adminValidation.js";
import { adminLogin } from "../controllers/admin/authController.js";
import User from "../models/User.js";
import { createUser, creditDebitList, creditDebitUser, deleteUser, listUser, updateUser, userDetails } from "../controllers/admin/userController.js";
import expressGroupRoutes from 'express-group-routes';

/***************************
        Vendor Login
***************************/

vendorAuthRoute.post('/login', 
  [
    body('email', 'Email field is Required').notEmpty().isEmail(),
    body('password', 'Password field is Required').notEmpty()
  ], 
  adminValiation,
  adminLogin
);


/****************************
  VENDOR AUTHENTICATED ROUTES 
*****************************/


/************************  USER CRUD ROUTES START ************************/
vendorAuthRoute.group("/vendor", (vendorAuthRoute) => {
  vendorAuthRoute.post('/create', [
    body('name').notEmpty().withMessage('name field is required'),
    body('email').notEmpty().withMessage('email field is required')
    .custom(async (email) => {
      const checkExists = await User.findOne({email:email,isDelete:false});
      if (checkExists) {
        throw new Error("email already in Exist");
      } else {
        return true;
      } 
    }),
    body('mobile').notEmpty().withMessage('mobile field is required')
    .custom(async (mobile) => {
      const checkExists = await User.findOne({mobile:mobile,isDelete:false});
      if (checkExists) {
        throw new Error("mobile already in Exist");
      } else {
        return true;
      } 
    }),
    body('password').notEmpty().withMessage('password field is required'),
    body('pan').notEmpty().withMessage('pan field is required')
    .custom(async (pan) => {
      const checkExists = await User.findOne({pan:pan,isDelete:false});
      if (checkExists) {
        throw new Error("pan already in Exist");
      } else {
        return true;
      } 
    }),
    body('aadhar').notEmpty().withMessage('aadhar field is required')
    .custom(async (aadhar) => {
      const checkExists = await User.findOne({aadhar:aadhar,isDelete:false});
      if (checkExists) {
        throw new Error("aadhar already in Exist");
      } else {
        return true;
      } 
    }),
  ], adminValiation, createUser);

  vendorAuthRoute.get('/', listUser);

  vendorAuthRoute.post('/get-details',
  [
    body('id').notEmpty().withMessage('email field is required')
  ],
  adminValiation,
   userDetails);

  vendorAuthRoute.put('/update', [
    body('id').notEmpty().withMessage('id field is required'),
    body('name').notEmpty().withMessage('name field is required'),
    body('email').notEmpty().withMessage('email field is required')
    .custom(async (email,{ req }) => {
      const checkExists = await User.findOne({email:email,isDelete:false,_id:{$ne:req?.body?.id}});
      if (checkExists) {
        throw new Error("email already in Exist");
      } else {
        return true;
      } 
    }),
    body('mobile').notEmpty().withMessage('mobile field is required')
    .custom(async (mobile,{ req }) => {
      const checkExists = await User.findOne({mobile:mobile,isDelete:false,_id:{$ne:req?.body?.id}});
      if (checkExists) {
        throw new Error("mobile already in Exist");
      } else {
        return true;
      } 
    }),
    body('password').notEmpty().withMessage('password field is required'),
    body('pan').notEmpty().withMessage('pan field is required')
    .custom(async (pan,{ req }) => {
      const checkExists = await User.findOne({pan:pan,isDelete:false,_id:{$ne:req?.body?.id}});
      if (checkExists) {
        throw new Error("pan already in Exist");
      } else {
        return true;
      } 
    }),
    body('aadhar').notEmpty().withMessage('aadhar field is required')
    .custom(async (aadhar,{ req }) => {
      const checkExists = await User.findOne({aadhar:aadhar,isDelete:false,_id:{$ne:req?.body?.id}});
      if (checkExists) {
        throw new Error("aadhar already in Exist");
      } else {
        return true;
      } 
    }),
  ], adminValiation, updateUser);

  vendorAuthRoute.delete('/delete/:id',deleteUser);

  vendorAuthRoute.post('/credit-debit-user', [
    body('userId').notEmpty().withMessage('userId field is required'),
    body('amount').notEmpty().withMessage('amount field is required')
    .custom(async (amount) => {
      if(Number(amount) > 0) {
        return true;
      } 
      throw new Error("amount must be grater than 0!!");
    }),
    body('type').notEmpty().withMessage('type field is required')
    .custom(async (type) => {
      if(type == 'credit' || type == 'debit') {
        return true;
      } 
      throw new Error("type must be credit or debit!!");
    }),
  ], adminValiation, creditDebitUser);

  vendorAuthRoute.post('/credit-debit-list', [
    // body('userId').notEmpty().withMessage('userId field is required'),
  ], adminValiation, creditDebitList);
  
});
/************************  USER CRUD ROUTES END ************************/


