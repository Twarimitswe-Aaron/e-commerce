import app from "./app.js";
import connectDatabase from "./DB/Database.js";
import dotenv from "dotenv";

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log("Server is shutting down due to uncaught exception");
    console.log(err.name, err.message);
    process.exit(1);
});

// Load environment variables
if (process.env.NODE_ENV !== "production") {
    dotenv.config({
        path: "./config/.env",
    });
}

const PORT = process.env.BACKEND_PORT || 5000;

// Connect to the database
connectDatabase();

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("Server is shutting down due to unhandled rejection");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});