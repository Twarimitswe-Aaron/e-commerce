import multer from "multer";
import ErrorHandler from "./utils/ErrorHandler.js";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if(!file){
            return cb(new ErrorHandler("Please upload an image"), false);
        }
        
        if(!fs.existsSync("uploads")){
            fs.mkdirSync("uploads")
        }
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = file.originalname.split(".")[0];
        cb(null, fileName + "-" + uniqueSuffix + ".png");
    },
});

export const upload = multer({ storage: storage });