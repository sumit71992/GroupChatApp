const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("user",user.userId)
        User.findByPk(user.userId).then(usr=>{
            // console.log("usr",usr)
            req.user=usr;
            // console.log(">>>>>>>>>>>>>",req.user)
            next();
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({message:"Please login first"});
    }
}
module.exports ={authenticate} ;