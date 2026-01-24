import mongoose from "mongoose";
import { required } from "zod/v4-mini";

const userSchema = new mongoose.Schema(
  {
    fatherName: {
      type: String,
      required: true,
    },
    NameStudent: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    PhoneNumber: {
      type: String,
      required: false,
    },
    PhoneNumberReal: {
      type: String,
      required: false,
    },
    grade: {
      type: String,
      required: true,
    },
    outstandingbalance: {
      required: false,
      type: Number,
      default: 0,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (this.isAdmin) {
    const existingAdmin = await this.constructor.findOne({ isAdmin: true });
    if (existingAdmin && existingAdmin._id.toString() !== this._id.toString()) {
      return next(
        new Error("Solo puede existir un administrador en el sistema"),
      );
    }
  }
  next();
});

export default mongoose.model("User", userSchema);
