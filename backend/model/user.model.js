import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "password required"],
  },

  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
});

// Hash password before saving to DB (pre-save)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// compare password before logging
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
