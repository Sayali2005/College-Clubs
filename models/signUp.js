const mongoose = require("mongoose");

const signUpSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        maxLength:16,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
});

const SignUp = mongoose.model("SignUp",signUpSchema);
module.exports= SignUp;