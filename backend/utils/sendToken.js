import ErrorHandler from "./ErrorHandler.js";

const sendToken = (user, statusCode, res) => {
    try {
        const token = user.getJwtToken();
        const { id, name, email, avatar } = user;
        
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            // domain: process.env.COOKIE_DOMAIN // Uncomment if you need specific domain
        };

        // Remove token from response body if you're setting it in cookies
        res.status(statusCode)
           .cookie("token", token, options)
           .json({
               success: true,
               user: { id, name, email, avatar },
               message: "Authentication successful"
           });
           
    } catch (error) {
        console.error("Token sending error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

export default sendToken;