async function login(email,password){
    try{
        const student = await SignUp.findOne({email:email});
        if(!SignUp){
            return null;
        }
        const isPasswordMatch = await bcrypt.compare(password,SignUp.password);
        if(!isPasswordMatch){
            return null;
        }
        return user;
    }
    catch(ere){
        console.log(err);
        return null;
    }
}