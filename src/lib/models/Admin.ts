import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },

    // 🔐 Forgot password fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // ✅ ADD THIS (VERY IMPORTANT)
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Admin ||
  mongoose.model("Admin", AdminSchema, "admins");