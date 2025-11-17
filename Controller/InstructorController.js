const { uploadToCloudinary } = require("../Cloudinary/cloudinary");
const AuthModel = require("../Model/AuthModel");
const CourseModel = require("../Model/CourseModel");
const { findByIdAndUpdate } = require("../Model/CourseModel");
const EnrollmentModel = require("../Model/EnrollmentModel");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const instructorSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, bio } = req.body;
    const isEmailExist = await AuthModel.findOne({ email });
    if (isEmailExist) {
      return res
        .status(409)
        .json({ message: "Email aldready exist", success: false });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Upload profile", success: false });
    }
    const path = req.file.path;
    const { success, error, result } = await uploadToCloudinary(path, {
      folder: "Instructor-profile",
    });
    if (!success) {
      return res
        .status(500)
        .json({ message: "Failed uploading profile", error, success: false });
    }

    const verificationToken = generateOTP();
    const tokenExpiry = Date.now() + 10 * 60 * 60;
    const instructor = new AuthModel({
      firstName,
      lastName,
      email,
      password,
      role: "instructor",
      bio,
      profile: result.secure_url,
      isActive: false,
      tokenExpiry,
      verificationToken,
      revenue: 0,
      isVerified: false,
    });
    await instructor.save();
    res.status(201).json({ message: "Instructor Created", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

const updateIntructor = async (req, res) => {
  try {
    // const {id}=req.params
    const id = req.user.id;
    const { firstName, lastName, bio } = req.body;
    const instructor = await AuthModel.findOne({ _id: id });
    if (!instructor) {
      return res
        .status(404)
        .json({ message: "Instructor not found", success: false });
    }
    let profileUrl = instructor.profile;
    if (req.file) {
      const { path } = req.file;
      const { success, result, error } = await uploadToCloudinary(path, {
        folder: "Instructor-profile",
      });
      if (!success) {
        return res
          .status(500)
          .json({ message: "Failed uploading profile", success: false });
      }
      profileUrl = result.secure_url;
    }
    instructor.firstName = firstName;
    instructor.lastName = lastName;
    instructor.bio = bio;
    instructor.profile = profileUrl;
    await instructor.save();
    res
      .status(200)
      .json({
        message: "Intructor profile updated",
        success: true,
        data: instructor,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

const updateIntructorActive = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Instructor id required", success: false });
    }
    const instructor = await AuthModel.findOneAndUpdate(
      id,
      { isActive: status },
      { new: true }
    );
    if (!instructor) {
      return res
        .status(404)
        .json({ message: "Instructor not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Instructor updated", data: instructor, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const getDashboardDetails = async (req, res) => {
  try {
    // const {id}=req.params
    const id = req.user.id;
    const courses = await CourseModel.find({ instructorId: id });
    const totalStudents = courses.reduce(
      (tot, value) => (tot += value.totalStudents),
      0
    );
    const courseIds=courses.map((value)=>value._id)
    const enrolled=await EnrollmentModel.find({courseId:{$in:courseIds}}).populate('courseId')
    res
      .status(200)
      .json({
        message: "Instructor dashboard fetched",
        success: true,
        totalStudents,
        courses,
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

module.exports = {
  instructorSignUp,
  updateIntructor,
  updateIntructorActive,
  getDashboardDetails,
};
