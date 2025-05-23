const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name  : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    mobileno : {
        type : Number,
        required : true
    },
    message : {
        type : String,
        required : true
    }
});

const Feedback = mongoose.model("Feedback",feedbackSchema);
module.exports= Feedback;