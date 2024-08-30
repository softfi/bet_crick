import Role from "../../models/Role.js";

export const createRoles = async (data) => {
  try {
    for (const role of data) {
      if (!(await Role.findOne({ name: role.name, isDeleted: false }))) {
        await Role.create({ name: role.name });
      } else {
        console.log(`Role name ${role.name} already exists! Skipped!`);
      }
    }
    console.log(`Roles created successfully!`);
  } catch (error) {
    console.log(error);
    return null;
  }
};
