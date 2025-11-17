const AuthModel = require("../Model/AuthModel")
const EnrollmentModel = require("../Model/EnrollmentModel")

const adminSignUp=async(req,res)=>{
    try {
       const {email,password}=req.body
       const Auth=await AuthModel.findOne({email})
       if(Auth)
       {
        return res.status(409).json({message:'Admin aldready exist',success:false})
       }
       const admin=new AuthModel({
        email,
        password,
        role:'admin'
       })
       await admin.save()
       res.status(201).json({message:"Admin created",success:true})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

const getAdminDashboard = async (req, res) => {
  try {
    // const {id}=req.params
    // const id = req.user.id;
    const instructors=await AuthModel.find({role:'instructor'})
    const students=await AuthModel.find({role:"student"})
    const enrolled=await EnrollmentModel.find().populate('courseId')
    res
      .status(200)
      .json({
        message: "Admin dashboard fetched",
        success: true,
        instructors,
        students,
        enrolled
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error?.message || error,
      });
  }
};


const userActivateToggle = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    if (!id) {
      return res
        .status(400)
        .json({ message: "Instructor id required", success: false });
    }
    const user = await AuthModel.findOne({_id:id})
    console.log(user)
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    user.isActive=!user.isActive
    console.log(user)
    await user.save()
    res
      .status(200)
      .json({ message: "User updated", data: user, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


module.exports={adminSignUp,getAdminDashboard,userActivateToggle}