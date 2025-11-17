const joi=require('joi')
const jwt=require('jsonwebtoken')



const instructorSignUpValidation=async (req,res,next)=>{
    try {
        const Schema=joi.object({
            firstName:joi.string().required(),
            lastName:joi.string().required(),
            email:joi.string().email().required(),
            password:joi.string().required().min(8).max(25),
            bio:joi.string().required(),
        })
        const {error}=await Schema.validate(req.body)
        if(error)
        {
            return res.status(400).json({message:"Bad request",success:false,error:error.details[0].message})
        }
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server error",error,success:false})
    }
}

const instructorLoginValidation=async(req,res,next)=>
{
    try {
        const Schema=joi.object({
            email:joi.string().required().email(),
            password:joi.string().required().min(8).max(25)
        })
        const {error}=await Schema.validate(req.body)
        if(error)
        {
            return res.status(400).json({message:"Bad request",success:false,error:error.details[0].message})
        }
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

const InstructorMiddleware=async(req,res,next)=>{
    try {
        const token=req.cookies.academy_token
        const secret_key=process.env.SECRET_KEY
        const verify=await jwt.verify(token,secret_key)
        if(!verify)
        {
            return res.status(401).json({message:"Un Authorised",success:false})
        }
        if(verify.role!=='admin'&&verify.role!=='instructor')
        {
            return res.status(403).json({message:"Only Instructor and Admin can access",success:false})
        }
        req.user=verify
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

module.exports={instructorLoginValidation,instructorSignUpValidation,InstructorMiddleware}