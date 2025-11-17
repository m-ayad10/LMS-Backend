const joi=require('joi')
const passwordValidation=async(req,res,next)=>{
    try {
        const signUpSchema=joi.object({ 
           prevPassword:joi.string().required(), 
           password:joi.string().required().min(8).max(25),    
           confirmPassword:joi.string().required().min(8).max(25),          
        })
        const {error}=await signUpSchema.validate(req.body)
        if(error)
        {
            return res.status(400).json({message:'Bad request',error:error.details[0].message,success:false})
        }
        next()
    } catch (error) {
        res.status(500).json({message:"Internal server Error",error,success:false})
    }
}



module.exports={passwordValidation}