const express=require('express');
const router=express.Router();
const User=require('./../models/user');
const {jwtAuthMiddleware, generateToken}= require('./jwt');

router.post('/signup', async(req,res)=>{
    try{
        const data = req.body //assuming the request body contains the person data

        //create a new person
        const newUser= new User(data);
        
        //save the new person to databse
        const response=await newUser.save({data});
        console.log('data saved');

        const payload={
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token=generateToken(payload)
        console.log("Token is :", token);

        res.status(200).json({message:"signup succesfully",result: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})

router.post('/login', async(req,res)=>{
    try{
        //extract aadhar number and password from request body 
        const {mobile,password}=req.body;

        //find the user by aadharcard
        const user=await User.findOne({mobile:mobile});

        //if user doesnot exist and password doesnot match
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid mobileno or password'})
        }
        console.log("login successful")
        //generate token
        const payload={
            id:user.id
        }
        const token=generateToken(payload)

        //return token as response
        res.json({token})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})

const blacklistedTokens = new Set(); // Store invalidated tokens (for small-scale apps)

router.post("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    blacklistedTokens.add(token); // Add token to blacklist

    return res.json({ message: "Logged out successfully" });
});

module.exports = router;
