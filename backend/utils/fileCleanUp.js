import fs from "fs";
import path from "path";
import User from "../model/user.js";
import { fileURLToPath } from "url";


const cleanUpOraphanedFiles= async()=>{
    const __filename=fileURLToPath(import.meta.url);
    const __dirname=path.dirname(__filename);
    const uploadDir=path.join(__dirname, "../uploads");

    fs.readdir(uploadDir, async (err,files)=>{
        if (err){
            console.error("Error reading directory:", err);
            return;
        }
        for (const file of files){
            const user=await User.findOne({avatar:file});
            if(!user){
                const filePath=path.join(uploadDir,file);
                fs.unlink(filePath, (err)=>{
                    if (err){
                        console.error("Error deleting file:", err);
                    }
                    else{
                        console.log(`File ${file} deleted successfully`);
                    }
                })
            }
        }
    })
}

export default cleanUpOraphanedFiles;