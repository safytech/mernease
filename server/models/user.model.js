import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: { type: ObjectId, ref: "User", default: null },
    updatedBy: { type: ObjectId, ref: "User", default: null },

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 3600000;
  return token;
};

userSchema.index({ fullname: 1, email: 1, phone: 1 });

const User = mongoose.model("User", userSchema);
export default User;
