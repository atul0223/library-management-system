import mongoose from "mongoose";
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  otp?: number;
  issuedBooks: Types.ObjectId[];
  role?: 'admin' | 'member';
}
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  email: { type: String, required: true, unique: true },
  otp: { type: Number },
  issuedBooks: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
  ],
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
},{timestamps:true});

const User = mongoose.model<IUser>("User", userSchema);

export default User;