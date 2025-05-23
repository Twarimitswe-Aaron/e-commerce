import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
        maxLength: [50, "Name cannot exceed 50 characters"],
        minLength: [2, "Name should be at least 2 characters"],
        match: [/^[a-zA-Z ]*$/, "Name can only contain letters and spaces"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
        minLength: [6, "Password should be at least 6 characters"],
        select: false,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{6,}$)/.test(v);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        }
    },
    role: {
        type: String,
        default: "User",
        enum: {
            values: ["User", "Admin"],
            message: "Role must be either User or Admin"
        }
    },
    avatar: {
        type: String,
        required: [true, "Avatar is required"],
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: "Avatar must be an image file (jpg, jpeg, png, gif)"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activationToken: {
        type: String,
        default: function() {
            return crypto.randomBytes(20).toString('hex');
        }
    },
    activationTokenExpire: {
        type: Date,
        default: function() { 
            return new Date(Date.now() + 6 * 60 * 1000); // 6 minutes
        }
    },
    lastLogin: {
        type: Date
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});


userSchema.index({ activationTokenExpire: 1 }, { 
    expireAfterSeconds: 0, 
    partialFilterExpression: { isActive: false } 
});

// Middleware
userSchema.pre("save", async function(next) {
    // Debug: Confirm password is modified
    console.log("[Debug] Password modified?", this.isModified("password"));

    if (!this.isModified("password")) return next();
    
    try {
        // Trim and hash
        this.password = await bcrypt.hash(this.password.trim(), 12);
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.methods = {
    comparePassword: async function(candidatePassword) {
        // Debug: Log inputs
        console.log("[Debug] Candidate:", candidatePassword);
        console.log("[Debug] Stored Hash:", this.password);
        
        return await bcrypt.compare(candidatePassword.trim(), this.password);
    },

    getJwtToken: function() {
        return jwt.sign(
            { id: this._id, role: this.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    },

    createPasswordResetToken: function() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
            
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        return resetToken;
    },

    changedPasswordAfter: function(JWTTimestamp) {
        if (this.passwordChangedAt) {
            const changedTimestamp = parseInt(
                this.passwordChangedAt.getTime() / 1000,
                10
            );
            return JWTTimestamp < changedTimestamp;
        }
        return false;
    }
};


userSchema.statics = {
    isEmailTaken: async function(email) {
        const user = await this.findOne({ email});
        return !!user;
    }
};

const User = mongoose.model("User", userSchema);
export default User;