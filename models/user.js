let mongoose = require("mongoose")
let bcrypt = require("bcrypt")

let userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: {type: String},
    otp:{type:Number},
    otp_createdAt:{String},
    otp_verified:{ type:Boolean,default:false},
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

let userModel = mongoose.model("user", userSchema)
module.exports = userModel
