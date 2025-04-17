const mongoose = require("mongoose");

const aloginSchema = new mongoose.Schema({
    email  : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
});

const ALogin = mongoose.model("ALogin",aloginSchema);
module.exports= ALogin;