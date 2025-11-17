const CourseModel = require("../Model/CourseModel");
const ReviewModel = require("../Model/ReviewModel");
const EnrollmentModel = require("../Model/EnrollmentModel");

const uploadReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { message, courseId, star } = req.body;
    // console.log(message,courseId,studentId,star)
    // const {message,courseId,studentId,star}=req.body
    const existingReview = await ReviewModel.findOne({ courseId, studentId });
    if (existingReview) {
      return res
        .status(409)
        .json({ message: "Review aldready exist from user", success: false });
    }
    const isEnrolled = await EnrollmentModel.findOne({ studentId, courseId });
    if (!isEnrolled) {
      return res
        .status(400)
        .json({ message: "Course is not enrolled", success: false });
    }
    await ReviewModel.insertOne({ studentId, courseId, star, message });
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { $inc: { totalNoOfRating: 1, totalRatings: star } },
      { new: true }
    );
    const reviews = await ReviewModel.find({ courseId }).populate('studentId')
    res
      .status(201)
      .json({ message: "Review uploaded", success: true, reviews, course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId, courseId, message, star } = req.body;
    await ReviewModel.updateOne({ _id: reviewId }, { message, star });
    const reviews = await ReviewModel.find({ courseId }).populate("studentId");
    res
      .status(200)
      .json({ message: "Review updated", success: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { reviewId, courseId } = req.body;
    await ReviewModel.deleteOne({ _id: reviewId });
    const reviews = await ReviewModel.find({ courseId });
    res
      .status(200)
      .json({ message: "Review deleted", success: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

const fetchAllReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Bad request", success: false });
    }
    const reviews = await ReviewModel.find({ courseId })
      .populate('studentId')
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Fetched all reviews", success: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

module.exports = { fetchAllReviews, updateReview, deleteReview, uploadReview };
