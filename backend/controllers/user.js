import express from "express";
import path from "path";
import { upload } from "../multer.js";
import User from "../model/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import sendToken from "../utils/sendToken.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import isAuthenticated  from "../middleware/auth.js";
import {validateUserName,validateUserEmail,validateUserPassword} from "../middleware/validation.js";
import {validationResult} from "express-validator";

const router = express.Router();

// Added validation middleware and error handling for validation
router.post(
  "/create-user",
  // [...validateUserName, ...validateUserEmail, ...validateUserPassword],
  upload.single("file"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      return next(new ErrorHandler("Please upload an image", 400));
    }

    // Check if user already exists
    const userExists = await User.isEmailTaken(email);
    if (userExists) {
      console.log(userExists, "user already exists");
      const filename = req.file.filename;
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const fileUrl = path.join(__dirname, "../uploads", filename);

      const deleteFile = async (path) => {
        await fs.promises.unlink(fileUrl).catch((err) => {
          console.log("Error deleting file:", err.message);
        });
      }
      if (!userExists.isActive) {
        await deleteFile(fileUrl).catch((err) => {
          console.log("Error deleting file:", err.message);
        })
        return next(new ErrorHandler("Go to your email to activate your account", 400));
      }

      await deleteFile(fileUrl).catch((err) => {
        console.log("Error deleting file:", err.message);
      })

      return next(new ErrorHandler("User with this email already exists", 400));
    }

    // Save user data
    const fileUrl = req.file.filename;
    const user = {
      name,
      email,
      password,
      avatar: fileUrl,
      isActive: false,
    };
    console.log(user, "user is stored in db");

    const newUser = await User.create(user);

    // Generate activation token
    const activationToken = createActivationToken({
      name,
      email,
      avatar: user.avatar,
    });
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      // Send activation email
      await sendMail({
        mail: email,
        subject: "Activate your account",
        message: `${name}, Please click on the link to activate your account ${activationUrl}`,
        html: `<p>${name},</p><p>Please click on the link below to activate your account:</p><a href="${activationUrl}">${activationUrl}</a>`,
      });
      console.log("go to your email to activate your account");

      res.status(201).json({
        success: true,
        message: `Please check your email: ${email} to activate your account`,
      });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
    algorithm: "HS256",
  });
};

router.post("/activation/", catchAsyncError(async (req, res, next) => {
  const { activation_token } = req.body;
  
  try {
    const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    const { email } = decoded;
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (user.isActive) {
      return next(new ErrorHandler("Account already activated", 400));
    }
    
    user.isActive = true;
    user.activationToken = undefined;
    user.activationTokenExpire = undefined;
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Account activated successfully"
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Activation token expired", 401));
    }
    return next(new ErrorHandler("Invalid activation token", 401));
  }
}));

router.post('/login-user', catchAsyncError(async (req,res,next)=>{
  const {email,password}=req.body;
  if(!email || !password){
    console.log(email,password,"email or password not found")
    return next(new ErrorHandler("Please enter email and password",400));
  }
  console.log(req.body)
  const user =await User.findOne({email}).select("+password");
  if(!user){
    console.log(user,"user not found")
    return next(new ErrorHandler("Invalid credentials",404));
  }
  console.log("user found")
  console.log(user)
  const isPasswordValid= await user.comparePassword(password)
  if(!isPasswordValid){
    console.log(isPasswordValid,"password not matched")
    return next(new ErrorHandler("Invalid credentials",401));
  }
  if(!user.isActive){
    console.log(user.isActive,"user not activated")
    return next(new ErrorHandler("Please activate your account",401));
  }
  console.log("user is sent token and cookied")
  sendToken(user,200,res);
}))

router.get('/get-user', isAuthenticated, catchAsyncError(async (req,res,next)=>{
 try {
  const user = await User.findById(req.user.id)
  if(!user){
    return next(new ErrorHandler("User not found",404));
  }

  res.status(200).json({
    success:true,
    user
  })
  
 } catch (error) {
  console.log(error.message)
  return next(new ErrorHandler(error.message,500))
 }
})
)

export default router;
