import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({path:'./config/.env'});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim:true,
        maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim:true,
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false, // Exclude password from query results by default
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin"],
    },
    avatar: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive:{
        type:Boolean,
        default:false,
    },activationTokenExpire:{
        type:Date,
        default:function (){return Date.now()+6*60*1000}, 
    }

});

userSchema.index({activationTokenExpire:1}, {expireAfterSeconds:0, partialFilterExpression:{isActive:false}});

userSchema.pre("save", async function (next) {
    
    if (!this.isModified("password")) {
        return next();
    }


    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJwtToken = function () {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_SECRET_EXPIRY,
    })
}




const User = mongoose.model("User", userSchema);
export default User;