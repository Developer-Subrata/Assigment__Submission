import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

const insertUsers = async () => {
  try {
    // ✅ Read user data from .env
    const users = [
      {
        name: process.env.T1_NAME,
        email: process.env.T1_EMAIL,
        role: process.env.T1_ROLE,
        password: await bcrypt.hash(process.env.T1_PASSWORD, 10), // Hash password
      },
      {
        name: process.env.S2_NAME,
        email: process.env.S2_EMAIL,
        role: process.env.S2_ROLE,
        password: await bcrypt.hash(process.env.S2_PASSWORD, 10), // Hash password
      },
    ];

    // ✅ Insert into MongoDB
    await User.insertMany(users);
    console.log("✅ Users inserted successfully!");

    // ✅ Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Insert Error:", error);
  }
};

insertUsers();
