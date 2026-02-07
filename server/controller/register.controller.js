import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

const registerController = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ errors: ["please provide email, name and password"] });
    }

    // check if user exists already
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ errors: ["user already exists, please login"] });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      name,
    });

    await newUser.save();

    // sign JWT and return token + basic user info for immediate login
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "dev-secret",
      {
        expiresIn: "7d",
      },
    );

    return res
      .status(201)
      .json({
        token,
        user: { id: newUser._id, email: newUser.email, name: newUser.name },
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ errors: ["server error"] });
  }
};

export default registerController;
