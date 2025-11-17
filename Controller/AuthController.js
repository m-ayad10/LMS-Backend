const {uploadToCloudinary} = require("../Cloudinary/cloudinary");
const AuthModel = require("../Model/AuthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthSignUp = async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    const { path } = req.file;
    const isEmailExist = await AuthModel.findOne({ email });
    if (isEmailExist) {
      return res
        .status(409)
        .json({ message: "Email aldready exist", success: false });
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
    const newAuth = new AuthModel({
      firstName,
      lastName,
      password,
      email,
      profile: result.secure_url,
    });
    newAuth.save();
    res.status(200).json({ message: "Auth created", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server Error", error, success: false });
  }
};

const AuthLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Auth = await AuthModel.findOne({ email });
    if (!Auth) {
      return res
        .status(401)
        .json({ message: "Invalid Credential", success: false });
    }
    if(!Auth.isVerified&&Auth.role!=='admin')
    {
      return res.status(401).json({message:"User not verified",success:false})
    }
    const comparePassword = await bcrypt.compare(password, Auth.password);
    if (!comparePassword) {
      return res
        .status(401)
        .json({ message: "Invalid Credential", success: false });
    }
    if(Auth.role==='instructor' && !Auth.isActive)
    {
      return res.status(403).json({message:"Access pending",success:false})
    }
    const secret_key = process.env.SECRET_KEY;
    const token = jwt.sign(
      { id: Auth._id, role: Auth.role },
      secret_key,
      { expiresIn: "6d" }
    );
    res.cookie('academy_token',token,{httpOnly:true})
    res
      .status(200)
      .json({ message: "Login successfully", success: true, data:Auth });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false ,error});
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required", success: false });
    }

    const auth = await AuthModel.findOne({ email });

    if (!auth) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (auth.isVerified) {
      return res.status(200).json({ message: "Already verified", success: true });
    }

    if (Date.now() > auth.tokenExpiry) {
      return res.status(400).json({ message: "OTP Expired", success: false });
    }

    if (auth.verificationToken !== String(otp)) {
      return res.status(403).json({ message: "Invalid OTP", success: false });
    }

    auth.isVerified = true;
    auth.verificationToken = "";
    auth.tokenExpiry = null; 
    await auth.save();

    return res.status(200).json({ message: "OTP verified successfully", success: true });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


const fetchAuth = async (req, res) => {
  try {
    // const { id } = req.params;
    const id=req.user.id
    const Auth = await AuthModel.findOne({ _id: id });
    if (!Auth) {
      return res
        .status(404)
        .json({ message: "Auth not found", success: false });
    }
    res.status(200).json({ message: "Auth found", success: true, data: Auth });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

const verifyToken=async(req,res)=>{
  try {
    const token= req.cookies.academy_token
    const secret_key=process.env.SECRET_KEY
    if(!token)
    {
      return res.status(404).json({message:"No token found",success:false})
    }
    const verify=await jwt.verify(token,secret_key)
    if(!verify)
    {
      res.status(401).json({message:"In valid Token",success:false})
      res.clearCookie('academy_token')
      return
    }
    const auth=await AuthModel.findOne({_id:verify.id})
    res.status(200).json({message:'User valid',success:true,data:auth})
  } catch (error) {
    res.status(500).json({message:"Internal server error",error,success:false})
  }
}

const deleteAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const Auth=await AuthModel.findOne({_id:id})
    if(!Auth)
    {
      return res.status(404).json({message:"Auth not found",success:false})
    }
    await AuthModel.deleteOne({ _id: id });
    res.status(204).json({ message: "Auth deleted", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updateAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const Auth = await AuthModel.findOne({ _id: id });
    if (!Auth) {
      return res
        .status(404)
        .json({ message: "Auth does not exist", success: false });
    }
    let profileUrl = Auth.profile;
    if (req.file) {
      const { path } = req.file;
      const { result, error, success } = await uploadToCloudinary(path, {
        folder: "Auth-profile",
      });
      if (!success) {
        return res
          .status(500)
          .json({ message: "Failed to update profile", success: false, error });
      }
      profileUrl = result.secure_url;
    }
    Auth.firstName = firstName;
    Auth.lastName = lastName;
    Auth.profile = profileUrl;
    const updatedAuth = await Auth.save();
    res
      .status(200)
      .json({ message: "Profile updated", success: true, data: updatedAuth });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const changePassword = async (req, res) => {
  try {
    // const { id } = req.params;
    const id=req.user.id  
    const {prevPassword, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password don't match confirm password",
        });
    }
    const Auth = await AuthModel.findOne({ _id: id });
    if (!Auth) {
      return res
        .status(404)
        .json({ success: false, message: "Auth not found" });
    }
    const comparePassword=await bcrypt.compare(prevPassword,Auth.password)
    if(!comparePassword)
    {
      return res.status(401).json({message:"Wrong password",success:false})
    }
    Auth.password=password
    await Auth.save();
    res.status(200).json({ message: "Password changed", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const fetchAllAuths = async (req, res) => {
  try {
    const Auths = await AuthModel.find();
    res
      .status(200)
      .json({ message: "Fetched all Auths", success: true, data: Auths });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

const logOut=(req,res)=>{
  try {
    const id=req.user.id
    res.clearCookie('academy_token')
    res.status(200).json({message:"Logout successfully",success:true})
  } catch (error) {
    res.status(500).json({message:"Internal server error",success:false,error:error?.message||error})
  }
}

module.exports = {
  AuthSignUp,
  AuthLogin,
  fetchAuth,
  deleteAuth,
  updateAuth,
  changePassword,
  fetchAllAuths,
  verifyToken,
  verifyOTP,
  logOut
};
