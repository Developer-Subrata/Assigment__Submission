import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  console.log("🔹 Login Attempt:", { email, role });

  try {
    const user = await User.findOne({ email, role });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Login Successful");
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
