import express from "express";
import { body } from "express-validator";
export const vendorRoute = express.Router();
export const vendorAuthRoute = express.Router();

/***************************
        CUSTOM IMPORTS
 ****************************/
import { vendorValiation } from "../validation/vendorValidation.js";
import { adminLogin } from "../controllers/admin/authController.js";
import User from "../models/User.js";
import { createCustomer, listCustomer,customerDetails, updateCustomer, deleteCustomer, creditDebitCustomer,creditDebitListByVendor } from "../controllers/vendor/userController.js";
import expressGroupRoutes from 'express-group-routes';
import { vendorLogin } from "../controllers/vendor/authController.js";

/***************************
        Vendor Login
***************************/

vendorRoute.post('/login', 
  [
    body('email', 'Email field is Required').notEmpty().isEmail(),
    body('password', 'Password field is Required').notEmpty()
  ], 
  vendorLogin
);


/****************************
  VENDOR AUTHENTICATED ROUTES 
*****************************/


/************************  USER CRUD ROUTES START ************************/
vendorAuthRoute.group("/customer", (vendorAuthRoute) => {
  vendorAuthRoute.post('/create', [
    body('name').notEmpty().withMessage('name field is required'),
    body('email').notEmpty().withMessage('email field is required')
    .custom(async (email) => {
      const checkExists = await User.findOne({email:email,isDeleted:false});
      if (checkExists) {
        throw new Error("email already in Exist");
      } else {
        return true;
      } 
    }),
    body('mobile').notEmpty().withMessage('mobile field is required')
    .custom(async (mobile) => {
      const checkExists = await User.findOne({mobile:mobile,isDeleted:false});
      if (checkExists) {
        throw new Error("mobile already in Exist");
      } else {
        return true;
      } 
    }),
    body('password').notEmpty().withMessage('password field is required'),
    body('pan').notEmpty().withMessage('pan field is required')
    .custom(async (pan) => {
      const checkExists = await User.findOne({pan:pan,isDeleted:false});
      if (checkExists) {
        throw new Error("pan already in Exist");
      } else {
        return true;
      } 
    }),
    body('aadhar').notEmpty().withMessage('aadhar field is required')
    .custom(async (aadhar) => {
      const checkExists = await User.findOne({aadhar:aadhar,isDeleted:false});
      if (checkExists) {
        throw new Error("aadhar already in Exist");
      } else {
        return true;
      } 
    }),
  ], vendorValiation, createCustomer);

  vendorAuthRoute.get('/', listCustomer);

  vendorAuthRoute.post('/get-details',
  [
    body('id').notEmpty().withMessage('id field is required')
  ],
  vendorValiation,
  customerDetails);

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
  ], vendorValiation, updateCustomer);

  vendorAuthRoute.delete('/delete/:id',deleteCustomer);

  vendorAuthRoute.post('/credit-debit', [
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
  ], vendorValiation, creditDebitCustomer);

  vendorAuthRoute.get('/credit-debit-list', creditDebitListByVendor);
  
});
/************************  USER CRUD ROUTES END ************************/


