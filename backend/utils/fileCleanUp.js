import fs from "fs/promises"; // Use promise-based fs API
import path from "path";
import User from "../model/user.js";
import { fileURLToPath } from "url";

const cleanUpOrphanedFiles = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadDir = path.join(__dirname, "../uploads");

    try {
        
        const files = await fs.readdir(uploadDir);

        
        await Promise.all(
            files.map(async (file) => {
                const user = await User.findOne({ avatar: file });
                if (!user) {
                    const filePath = path.join(uploadDir, file);
                    try {
                        
                        await fs.unlink(filePath);
                        console.log(`Deleted orphaned file: ${file}`);
                    } catch (error) {
                        console.error(`Error deleting file ${file}:`, error.message);
                    }
                }
            })
        );
    } catch (error) {
        console.error("Error cleaning up orphaned files:", error.message);
    }
};

export default cleanUpOrphanedFiles;