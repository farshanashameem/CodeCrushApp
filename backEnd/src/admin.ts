// createAdmin.ts

import bcrypt from "bcrypt";
import { connectDB } from "./Infrastructure/Config/mongo.config";

import { AdminModel } from "./Infrastructure/Database/Model/AdminModel";
import UserRole from "./Domain/enums/UserRole.enum";

async function createAdmin() {
  try {
    await connectDB();

    const existingAdmin =
      await AdminModel.findOne({
        email: "admin@gmail.com",
      });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        "Admin@123",
        10
      );

    await AdminModel.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    console.log(
      "Admin created successfully"
    );

    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();