import readline from "readline";
import mongoose from "mongoose";
import { readFile } from "fs/promises";
import { createSuperAdmin } from "./seeds/admin.js";
import { createRoles } from "./seeds/role.js";
import { DB_HOST, DB_NAME, DB_PORT, SEEDER_PASSWORD } from "../config/config.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://'+DB_HOST+':'+DB_PORT+'/'+DB_NAME+'');
    console.log("Database Connected Successfully!");
    performSeeding();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

const performSeeding = () => {
  rl.question("Enter the seeding key : ", async (key) => {
    rl.close();
    if (key === SEEDER_PASSWORD) {
    // if (true) {
      try {
        if (mongoose.connection.readyState !== 1) {
          console.error("MongoDB connection not ready. Seeding aborted.");
          process.exit(1);
        }

          let rolesData = await readFile("seeder/data/roles.json", "utf-8");

          if (rolesData) {
            rolesData = JSON.parse(rolesData);
            await createRoles(rolesData);

            let superAdminData = await readFile(
              "seeder/data/admin.json",
              "utf-8"
            );

            if (superAdminData) {
              superAdminData = JSON.parse(superAdminData);
              await createSuperAdmin(superAdminData);
            } else {
              process.exit(1);
            }
          } else {
            process.exit(1);
          }
        

        mongoose.connection.close();
        console.log("Database Disconnected.");
        process.exit(1);
      } catch (error) {
        console.error("Error during seeding operations:", error);
        process.exit(1);
      }
    } else {
      console.error("Invalid key. Seeding aborted.");
      process.exit(1);
    }
  });
};

connectToDatabase();
