import express from "express";
import { body } from "express-validator";
export const adminRoute = express.Router();
export const adminAuthRoute = express.Router();



/***************************
        CUSTOM IMPORTS
 ****************************/
import { adminValiation, uploadImageValdator } from "../validation/adminValidation.js";
import { adminLogin } from "../controllers/admin/authController.js";
import { addMenus, adminMenusList, deleteMenus } from "../controllers/admin/menuController.js";
import { addRole, deleteRole, getRoleById, roleList, updateRole } from "../controllers/admin/roleController.js";
import { uploadImage } from "../controllers/admin/uploadController.js";
import { multerImageUpload } from "../config/config.js";
import { assignPermissionsToRole, getPermissionByRole } from "../controllers/admin/permissionController.js";
import { addAndUpdateValue, addType, getSettings } from "../controllers/admin/settingController.js";
import Setting from "../models/Setting.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { createUser, creditDebitList, creditDebitUser, deleteUser, listUser, updateUser, userDetails } from "../controllers/admin/userController.js";
// import { createVendor, listVendor } from "../controllers/admin/vendorController.js";
import expressGroupRoutes from 'express-group-routes';

/***************************
        Admin Login
***************************/

adminRoute.post('/login', 
  [
    body('email', 'Email field is Required').notEmpty().isEmail(),
    body('password', 'Password field is Required').notEmpty()
  ], 
  adminValiation,
  adminLogin
);


/****************************
  ADMIN AUTHENTICATED ROUTES 
*****************************/

/************************  Menus Routes ************************/

adminAuthRoute.get('/menus-list', adminMenusList);
adminAuthRoute.post('/add-menus', [
  body('name', 'name feild is required').notEmpty(),
  body('url', 'url feild is required').notEmpty(),
  body('icon', 'icon feild is required').notEmpty(),
  body('parentId', 'parentId feild is required').optional(),
  body('sortOrder', 'sort order feild is required').notEmpty(),
  body('for', 'for feild is required').notEmpty().custom(async (value) => {
    if (value === 'customer' || value === 'admin') {
      return true;
    } else {
      throw new Error('for should only have "customer" and "admin"')
    }
  }),
], adminValiation, addMenus);

adminAuthRoute.delete('/soft-delete', [
  body("menuId", "Menu Id Field Is Required").notEmpty()
], adminValiation, deleteMenus);



/************************  ROLES ROUTES START ************************/

adminAuthRoute.get('/roles', roleList);

adminAuthRoute.post('/roles', [
  body('name', "Name field is Required").notEmpty(),
], adminValiation, addRole);

adminAuthRoute.get('/roles/:roleId', getRoleById);

adminAuthRoute.put('/roles', [
  body('roleId').notEmpty().withMessage("Role Id field is Required"),
  body('name').notEmpty().withMessage("Name field is Required"),
  body('isActive').optional(),
], adminValiation, updateRole);


adminAuthRoute.delete('/roles', [
  body('roleId').notEmpty().withMessage("Role Id field is Required"),
], adminValiation, deleteRole);

/************************  ROLES ROUTES END ************************/

/************************  PERMISSION ROUTES START ************************/

adminAuthRoute.post('/get-permission-by-role', getPermissionByRole);

adminAuthRoute.post("/assign-permissions", assignPermissionsToRole);

/************************  PERMISSION ROUTES END ************************/

/************************  UPLOADS ROUTES START ************************/

adminAuthRoute.post('/upload-image', multerImageUpload.single('image'), uploadImageValdator, uploadImage);

/************************  UPLOADS ROUTES END ************************/


/************************  SETTING ROUTES START ************************/

adminAuthRoute.get('/settings', getSettings);

adminAuthRoute.post('/settings/type', [
  body('type').notEmpty().withMessage('Type field is required').custom(async(type)=>{
    let setting = await Setting.findOne({ type });
    if(setting){
      throw new Error("Type is Already Exists");
    }
    return true
  })
], adminValiation, addType);

adminAuthRoute.post('/settings/value', [
  body('type').notEmpty().withMessage('Type field is required'),
  body('value').notEmpty().withMessage('Value field is required')
], adminValiation, addAndUpdateValue);

/************************  SETTING ROUTES END ************************/


/************************  USER CRUD ROUTES START ************************/
adminAuthRoute.group("/user", (adminAuthRoute) => {
  adminAuthRoute.post('/create', [
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
    body('roleId').notEmpty().withMessage('role field is required')
    .custom(async (role) => {
      console.log(role);
      const checkExists = await Role.findOne({_id:role,isDeleted:false});
      if (!checkExists) {
        throw new Error("Invalid role, please enter the correct role");
      } else {
        return true;
      } 
    }),
  ], adminValiation, createUser);

  adminAuthRoute.get('/', listUser);

  adminAuthRoute.post('/get-details',
  [
    body('id').notEmpty().withMessage('email field is required')
  ],
  adminValiation,
   userDetails);

  adminAuthRoute.put('/update', [
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
    // body('password').notEmpty().withMessage('password field is required'),
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

  adminAuthRoute.delete('/delete/:id',deleteUser);

  adminAuthRoute.post('/credit-debit-user', [
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

  adminAuthRoute.post('/credit-debit-list', [
    // body('userId').notEmpty().withMessage('userId field is required'),
  ], adminValiation, creditDebitList);
  
});
/************************  USER CRUD ROUTES END ************************/



/************************  VENDOR CRUD ROUTES START ************************/
// adminAuthRoute.group("/vendor", (adminAuthRoute) => {
//   adminAuthRoute.post('/create', [
//     body('name').notEmpty().withMessage('name field is required'),
//     body('email').notEmpty().withMessage('email field is required')
//     .custom(async (email) => {
//       const checkExists = await User.findOne({email:email,isDeleted:false});
//       if (checkExists) {
//         throw new Error("email already in Exist");
//       } else {
//         return true;
//       } 
//     }),
//     body('mobile').notEmpty().withMessage('mobile field is required')
//     .custom(async (mobile) => {
//       const checkExists = await User.findOne({mobile:mobile,isDeleted:false});
//       if (checkExists) {
//         throw new Error("mobile already in Exist");
//       } else {
//         return true;
//       } 
//     }),
//     body('password').notEmpty().withMessage('password field is required'),
//     body('pan').notEmpty().withMessage('pan field is required')
//     .custom(async (pan) => {
//       const checkExists = await User.findOne({pan:pan,isDeleted:false});
//       if (checkExists) {
//         throw new Error("pan already in Exist");
//       } else {
//         return true;
//       } 
//     }),
//     body('aadhar').notEmpty().withMessage('aadhar field is required')
//     .custom(async (aadhar) => {
//       const checkExists = await User.findOne({aadhar:aadhar,isDeleted:false});
//       if (checkExists) {
//         throw new Error("aadhar already in Exist");
//       } else {
//         return true;
//       } 
//     }),
//   ], adminValiation, createVendor);

//   adminAuthRoute.get('/', listVendor);

//   // adminAuthRoute.post('/get-details'),
//   // [
//   //   body('id').notEmpty().withMessage('email field is required')
//   // ],
//   // adminValiation,
//   //  userDetails);

//   // adminAuthRoute.put('/update', [
//   //   body('id').notEmpty().withMessage('id field is required'),
//   //   body('name').notEmpty().withMessage('name field is required'),
//   //   body('email').notEmpty().withMessage('email field is required')
//   //   .custom(async (email,{ req }) => {
//   //     const checkExists = await User.findOne({email:email,isDelete:false,_id:{$ne:req?.body?.id}});
//   //     if (checkExists) {
//   //       throw new Error("email already in Exist");
//   //     } else {
//   //       return true;
//   //     } 
//   //   }),
//   //   body('mobile').notEmpty().withMessage('mobile field is required')
//   //   .custom(async (mobile,{ req }) => {
//   //     const checkExists = await User.findOne({mobile:mobile,isDelete:false,_id:{$ne:req?.body?.id}});
//   //     if (checkExists) {
//   //       throw new Error("mobile already in Exist");
//   //     } else {
//   //       return true;
//   //     } 
//   //   }),
//   //   body('password').notEmpty().withMessage('password field is required'),
//   //   body('pan').notEmpty().withMessage('pan field is required')
//   //   .custom(async (pan,{ req }) => {
//   //     const checkExists = await User.findOne({pan:pan,isDelete:false,_id:{$ne:req?.body?.id}});
//   //     if (checkExists) {
//   //       throw new Error("pan already in Exist");
//   //     } else {
//   //       return true;
//   //     } 
//   //   }),
//   //   body('aadhar').notEmpty().withMessage('aadhar field is required')
//   //   .custom(async (aadhar,{ req }) => {
//   //     const checkExists = await User.findOne({aadhar:aadhar,isDelete:false,_id:{$ne:req?.body?.id}});
//   //     if (checkExists) {
//   //       throw new Error("aadhar already in Exist");
//   //     } else {
//   //       return true;
//   //     } 
//   //   }),
//   // ], adminValiation, updateUser);

//   // adminAuthRoute.delete('/delete/:id',deleteUser);

//   // adminAuthRoute.post('/credit-debit-user', [
//   //   body('userId').notEmpty().withMessage('userId field is required'),
//   //   body('amount').notEmpty().withMessage('amount field is required')
//   //   .custom(async (amount) => {
//   //     if(Number(amount) > 0) {
//   //       return true;
//   //     } 
//   //     throw new Error("amount must be grater than 0!!");
//   //   }),
//   //   body('type').notEmpty().withMessage('type field is required')
//   //   .custom(async (type) => {
//   //     if(type == 'credit' || type == 'debit') {
//   //       return true;
//   //     } 
//   //     throw new Error("type must be credit or debit!!");
//   //   }),
//   // ], adminValiation, creditDebitUser);

//   // adminAuthRoute.post('/credit-debit-list', [
//   //   // body('userId').notEmpty().withMessage('userId field is required'),
//   // ], adminValiation, creditDebitList);
  
// });
/************************  USER CRUD ROUTES END ************************/


