const mongoose = require('mongoose');
const SignUp = require("./models/admin.js");

main()
    .then(()=>{console.log("Conection Successful!!!")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/CollegeSIGCE');
}

let allAdmins = [
    {
    email:"aidsHOD@gmail.com",
    password:"Aids@403",
    },
    {
    email:"compsHOD@gmail.com",
    password:"Comps@403",
    },
        {
    email:"iotHOD@gmail.com",
    password:"Iot@403",
    },
        {
    email:"aimlHOD@gmail.com",
    password:"Aiml@403",
    }    
] 

SignUp.insertMany(allAdmins);