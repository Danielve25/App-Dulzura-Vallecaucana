import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    NameStudent: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    PhoneNumber: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
