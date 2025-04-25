import ErrorHandler from "./ErrorHandler.js";

const sendToken = (user, statusCode, res) => {
    try {
        const token = user.getJwtToken();
        const { id, name, email, avatar } = user;
        
        // Cookie options
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/", // Important for cookie accessibility
            // domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined
        };

        // Send response
        res.status(statusCode)
           .cookie("token", token, options)
           .json({
               success: true,
               user: { id, name, email, avatar },
               token, // Optional: Send token in response body too
               message: "Authentication successful"
           });
           
    } catch (error) {
        console.error("Token sending error:", error);
        return ErrorHandler(error, res); // Use your ErrorHandler
    }
};

export default sendToken;