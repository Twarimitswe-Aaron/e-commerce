import ErrorHandler from "./ErrorHandler.js";
const sendToken=(user,statusCode,res,next)=>{
    const token=user.getJwtToken();
    const {id,name,email,avatar}=user;
    const options={
        expires: new Date(new Date()+90*24*60*60*1000),
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"Strict"
    }
   try{
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user:{id,name,email,avatar},
        token,
        message:"User created successfully"
        
    })
   }catch(error){
    console.log(error.message);
    return next(new ErrorHandler(error.message, 500));
   }
}

export default sendToken;