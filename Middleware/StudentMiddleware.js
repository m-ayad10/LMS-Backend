const joi=require('joi')
const jwt=require('jsonwebtoken')


const SignUpValidation=async(req,res,next)=>{
    try {
        const signUpSchema=joi.object({
            firstName:joi.string().required(),
            lastName:joi.string().required(),
            password:joi.string().required().min(8).max(20),
            email:joi.string().required().email()
        })
        const {error}=await signUpSchema.validate(req.body)
        if(error)
        {
            return res.status(409).json({message:'Something went wrong',error:error.details[0].message,success:false})
        }
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server Error",error,success:false})
    }
}

const LoginValidation=async(req,res,next)=>
{
    try {
        const loginSchema=joi.object({
            password:joi.string().required().min(8).max(20),
            email:joi.string().required().email()
        })
        const {error}=await loginSchema.validate(req.body)
        if(error)
        {
            return res.status(400).json({message:"Bad request",error:error.details[0].message,success:false})
        }
        next()
    } catch (error) {
        res.status(500).json({message:"Internal dserver error",error,success:false})
    }
}
const StudentMiddleware=async(req,res,next)=>{
    try {
        const token=req.cookies.academy_token
        const secret_key=process.env.SECRET_KEY
        const verify=await jwt.verify(token,secret_key)
        if(!verify)
        {
            return res.status(401).json({message:"Un Authorised",success:false})
        }
        req.user=verify
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

module.exports={SignUpValidation,LoginValidation,StudentMiddleware}