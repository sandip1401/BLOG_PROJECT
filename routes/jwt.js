const jwt=require('jsonwebtoken');
const jwtAuthMiddleware=(req,res,next)=>{
    //first check request headers has authorize or not
    const authorization = req.headers.authorization;
    // console.log("=======>token",authorization)
    if(!authorization) return res.status(401).json({error: 'Token Not Found'});

    //Extract the jwt token from the request header
    const token = req.headers.authorization.split(' ')[1];
    // console.log("token here",token);
    if(!token) return res.status(401).json({error:'Unauthorize'});

    try{
        //verify the jwt token;
        console.log(process.env.JWT_SECRET)
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        //attach user information to the request object
        req.user=decoded
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Invalid token'});
    }
}

//generate jwt token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


module.exports={jwtAuthMiddleware,generateToken};