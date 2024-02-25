import mongoose from "mongoose";
import bcrypt from "bcrypt";
import pkg from 'validator';
const { isEmail } = pkg;

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "incorrect password"],
    },
  },
  { timestamps: true }
);

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const userModel = mongoose.model("user", userSchema);
export default userModel;
