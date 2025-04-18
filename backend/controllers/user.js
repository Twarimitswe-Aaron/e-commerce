import express from "express";
import path from "path";
import { upload } from "../multer.js";
import User from "../model/user.js";
import ErrorHandler from "../middleware/error.js";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!req.file) {
    return next(new ErrorHandler("Please upload an image", 400));
  }
  const userEmail = await User.findOne({ email });
  // console.log(req.body);

  if (userEmail) {
    console.log(userEmail, "user already exists");
    const filename = req.file.filename;
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const fileUrl = path.join(__dirname, "../uploads", filename);
    console.log(fileUrl, "not got");
    fs.unlink(fileUrl, (err) => {
      if (err) {
        console.log(err.message);
        return res.status(400).json({ message: "Error deleting file" });
      } else {
        console.log(name,"user already exists")
        console.log("user already exists");
        return res.status(500).json({ message: "File deleted successfully" });
      }
    });
    
    return;
  }

  const filename = req.file.filename;
  const fileUrl = filename;

  const user = {
    name: name,
    email: email,
    password: password,
    avatar: fileUrl,
  };
  

  const newUser = await User.create(user);
  res.status(201).json({
    success: true,
    newUser,
  });
  console.log(newUser);
});

export default router;
