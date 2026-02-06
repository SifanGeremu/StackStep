import bcrypt from "bcrypt";
import User from "../models/users.js";

const registerController = async (req,res)=>{
    try {
  const { email,name,password } = req.body;
  if (!email ||!name|| !password) {
    return res
      .status(400)
      .json({ message: "please provide email, name and password" });
  }

  // check if user exists already
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "user already exists,please Login" });
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return res.status(201).json({ message: "registered successfully" });
} catch (error) {
  console.log(error.message);
  return res.status(500).json({ message: "server error" });
}}

export default registerController;