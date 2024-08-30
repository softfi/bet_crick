import { hashPassword } from "../../helpers/helper.js";
import Role from "../../models/Role.js";
import User from "../../models/User.js";

export const createSuperAdmin = async (data) => {
  const checkNullDb = await User.find({});

  if (checkNullDb.length === 0) {
    let superAdminRoleId = await Role.find().limit(1).lean();

    if (superAdminRoleId.length === 0) {
      console.log("There's no role to assign!");
    }

    await User.create({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: await hashPassword(data.password),
      role: superAdminRoleId[0]._id,
    });

    console.log("Admin created...!");
  } else {
    console.log("Users are already in the database, skipped!");
  }
};
