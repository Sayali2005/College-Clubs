const mongoose = require('mongoose');
const SignUp = require("./models/signUp.js");

main()
    .then(()=>{console.log("Conection Successful!!!")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/CollegeSIGCE');
}


let allStd = [
    {
    name:"Sayali Ghagare",
    email:"2023ad23f@gmail.com",
    password:"sayali@23",
    year:"SE",
    branch:"AIDS"
    },
    {
    name:"Bhumika Yeole",
    email:"2023ad71f@gmail.com",
    password:"bhu@71",
    year:"SE",
    branch:"AIDS"
    },
    {
    name:"Bhakti Patil",
    email:"2023ad37f@gmail.com",
    password:"bhakti@37",
    year:"SE",
    branch:"AIDS"
    },
];

SignUp.insertMany(allStd);