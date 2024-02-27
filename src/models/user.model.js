import mongoose, {Schema} from "mongoose";

import jwt from "jsonwebtoken"
import bcrypt from "brypt"

const userSchema = new Schema ({
    username:{
        type:String,
        required: true,
        unique : true,
        lowercase: true,
        trim: true,
        index: true
    },

    email:{
        type:String,
        required: true,
        unique : true,
        lowercase: true,
        trim: true,
    
    },

    fullname:{
        type:String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type:String,
        required: true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref : "Video"
    },
    password:{
        type:String,
        required: [true,'Password is required']
    },

    refreshToken: {
        type : String
    }
},
{
    timestamps: true
}
)

userSchema.pre("save",async function (next){
    if(!this.isModifed("password")) return next();
    this.password = bcrypt.hash(this.password,10);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password, this.passowrd)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id :this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateRefressToken = function(){
   return jwt.sign({
        _id :this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User",userSchema);