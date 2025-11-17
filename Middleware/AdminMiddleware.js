const joi=require("joi")
const jwt=require('jsonwebtoken')
require('dotenv').config()

const adminSignUpValidation=async(req,res,next)=>
{
    try {
        const Schema=joi.object({
            email:joi.string().required().email(),
            password:joi.string().required().min(8).max(20)
        })
        const {error}=Schema.validate(req.body)
        if(error)
        {
            return res.status(400).json({message:"Bad request",success:false,error:error.details[0].message})
        }
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false})
    }
}

const AdminMiddleware=async(req,res,next)=>{
    try {
        const token=req.cookies.academy_token
        const secret_key=process.env.SECRET_KEY
        const verify=await jwt.verify(token,secret_key)
        if(!verify)
        {
            return res.status(401).json({message:"Un Authorised",success:false})
        }
        if(verify.role!=='admin')
        {
            return res.status(403).json({message:"Only admin can access",success:false})
        }
        req.user=verify
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}


module.exports={adminSignUpValidation,AdminMiddleware}