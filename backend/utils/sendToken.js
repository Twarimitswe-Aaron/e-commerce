import ErrorHandler from "./ErrorHandler.js";

const sendToken = (user, statusCode, res) => {
    try {
        const token = user.getJwtToken();
        const { id, name, avatar } = user;
        console.log(user)
        
        
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
            sameSite: "none",
        };
        res.status(statusCode)
           .cookie("token", token, options)
           .json({
               success: true,
               user: { id, name, avatar },
               message: "Authentication successful"
           });
           
    } catch (error) {
        console.error("Token sending error:", error);
        return ErrorHandler(error, statusCode); // Use your ErrorHandler
    }
};

export default sendToken;