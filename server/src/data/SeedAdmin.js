import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDatabase } from "../config/db.js";

try {
  await connectDatabase();

  const adminEmail = "admin@freshbasket.com";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("✅ Admin account already exists.");
  } else {
    const admin = await User.create({
      name: "FreshBasket Admin",
      email: adminEmail,
      phone: "9999999999",
      password: "Admin@12345",
      role: "admin",
    });

    console.log("🎉 Admin account created successfully!");
    console.log("Email:", admin.email);
    console.log("Password: Admin@12345");
  }
} catch (error) {
  console.error("❌ Error creating admin:", error.message);
} finally {
  await mongoose.connection.close();
}