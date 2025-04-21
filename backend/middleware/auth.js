import jwt from "jsonwebtoken";
import User from "../model/user.js";
import catchAsyncError from "./catchAsyncError.js";

const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData.id);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired, please login again", 401));
    }
    return next(new ErrorHandler("Invalid token", 401));
  }
});

export default isAuthenticated;