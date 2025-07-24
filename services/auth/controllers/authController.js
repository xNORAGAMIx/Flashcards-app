import User from "../models/Users.js";
import { generateToken } from "../utils/generateToken.js";
import { userCreationErrors } from "../utils/userErrorCache.js";
import { publishUserCreated } from "../utils/rabbit.js";
import bcrypt from "bcryptjs";

// export const register = async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: "Email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await publishUserCreated(user);
    
//     res.status(201).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: generateToken(user._id),
//     });
    
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await publishUserCreated(user); // send to RabbitMQ

    // Wait for error from user service (max 3s)
    const error = await new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 3000);
      const interval = setInterval(() => {
        const msg = userCreationErrors.get(user._id.toString());
        if (msg) {
          clearTimeout(timeout);
          clearInterval(interval);
          userCreationErrors.delete(user._id.toString());
          resolve(msg);
        }
      }, 200);
    });

    if (error) {
      await User.deleteOne({ _id: user._id }); // Cleanup if needed
      return res.status(400).json({ message: error });
    }

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
