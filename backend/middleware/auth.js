import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import catchAsyncErrors from "express-async-handler";
import User from "../model/user.js";
import catchAsyncError from "./catchAsyncError.js";

const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const {token} = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  next();
})