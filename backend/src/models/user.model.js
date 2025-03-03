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
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
