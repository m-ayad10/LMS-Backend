const {uploadToCloudinary} = require("../Cloudinary/cloudinary");
const AuthModel = require("../Model/AuthModel");
const crypto=require('crypto');
const sendOTPEmail = require("../Nodemailer/Nodemailer");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
const studentSignUp = async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    if(!req.file)
    {
        return res.status(400).json({message:"Upload profile",success:false})
    }
    const { path } = req.file;
    const isEmailExist = await AuthModel.findOne({ email });
    if (isEmailExist) {
      if (!isEmailExist.isVerified) {
        await AuthModel.deleteOne({_id:isEmailExist.id})
      }else{
       return res
           .status(409)
             .json({ message: "Email aldready exist", success: false });
      }
    }
    const { success, error, result } = await uploadToCloudinary(path, {
      folder: "Auth-profile",
    });
    if (!success) {
      return res.status(500).json({
        message: "Failed to upload file",
        success: false,
        error: error.message,
      });
    }

    const verificationToken=generateOTP()
    const tokenExpiry=Date.now()+(10*60*60)

    const newAuth = new AuthModel({
      firstName,
      lastName,
      password,
      email,
      role:'student',
      profile: result.secure_url,
      verificationToken,
      tokenExpiry,
      isVerified:false
    });
    await newAuth.save();

    await sendOTPEmail(email,verificationToken)
    res.status(200).json({ message: "Verification email sent!", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server Error", error, success: false });
  }
};

const updateStudent = async (req, res) => {
  try {
    // const { id } = req.params;
    const id=req.user.id
    const { firstName, lastName } = req.body;
    const Auth=await AuthModel.findOne({_id:id})
    if(!Auth)
    {
      return res.status(404).json({message:"Auth does not exist",success:false})
    }
    let profileUrl=Auth.profile
    if (req.file) {
      const {path}=req.file
      const { result, error, success } = await uploadToCloudinary(path, {
        folder: "Auth-profile",
      });
      if (!success) {
        return res
          .status(500)
          .json({ message: "Failed to update profile", success: false, error });
      }
      profileUrl=result.secure_url
    }
    Auth.firstName=firstName
    Auth.lastName=lastName
    Auth.profile=profileUrl
    await Auth.save()
      res
        .status(200)
        .json({ message: "Profile updated", success: true, data: Auth });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports={studentSignUp,updateStudent}