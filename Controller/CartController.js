const CartModel = require("../Model/CartModel");
const CourseModel = require("../Model/CourseModel");
const EnrollmentModel = require("../Model/EnrollmentModel");
const WishlistModel = require("../Model/WishlistModel");

require("dotenv").config();

const fetchCart = async (req, res) => {
  try {
    const studentId = req.user.id;
    // const{ id:studentId}=req.params
    const cart = await CartModel.findOne({ studentId }).populate({
      path: "courses.courseId",
      populate: { path: "instructorId", model: "auths" },
      select: "title price thumbnail instructorId",
    });
    res
      .status(200)
      .json({ message: "Cart fetched", success: true, data: cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

const addToCart = async (req, res) => {
  try {
    // const {courseId,studentId}=req.body
    const studentId = req.user.id;
    const { courseId } = req.body;
    const isUserExist = await CartModel.findOne({ studentId });
    const course = await CourseModel.findOne({ _id: courseId });
    if(!course)
    {
        return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }
    const isEnrolled = await EnrollmentModel.findOne({ courseId, studentId });
    if (isEnrolled) {
      return res
        .status(409)
        .json({ message: "Course alldready enrolled", success: false });
    }
    if (isUserExist) {
      const isCourseExist = isUserExist.courses.find(
        (value) => value.courseId.toString() === courseId
      );
      if (isCourseExist) {
        return res
          .status(409)
          .json({ message: "Course alldready exist in cart", success: false });
      }
      isUserExist.courses.push({ courseId });
      isUserExist.totalPrice += course.price;
      // console.log(isUserExist)
      await isUserExist.save();
      // console.log(wishlist)
      await WishlistModel.deleteOne({ courseId, studentId })
      const cart = await CartModel.findOne({ studentId }).populate({
      path: "courses.courseId",
      populate: { path: "instructorId", model: "auths" },
      select: "title price thumbnail instructorId",
    });
      const wishlist = await WishlistModel.find({ studentId }).populate(
        "courseId"
      );
      res
        .status(201)
        .json({
          message: "Course added to cart",
          success: true,
          cart,  
          wishlist     
        });
    } else {
      let courses = [{ courseId }];
      const newCart = new CartModel({ studentId, courses });
      newCart.totalPrice += course.price;
      await newCart.save();
      await WishlistModel.deleteOne({ courseId, studentId });
      const wishlist = await WishlistModel.find({ studentId }).populate(
        "courseId"
      );
      res
        .status(201)
        .json({
          message: "Added to cart",
          success: true,
          cart: newCart, 
          wishlist
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const removeFromCart = async (req, res) => {
  try {
    // const { courseId, studentId } = req.body;

    const { courseId } = req.body;
    const studentId = req.user.id;
    const cart = await CartModel.findOne({ studentId });
    if (!cart)
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });

    const index = cart.courses.findIndex(
      (value) => value.courseId.toString() === courseId
    );

    if (index === -1)
      return res
        .status(404)
        .json({ message: "Course not found in cart", success: false });

    const course = await CourseModel.findById(courseId);
    if (course?.price) cart.totalPrice -= course.price;

    cart.courses.splice(index, 1);
    await cart.save();
      const newCart = await CartModel.findOne({ studentId }).populate({
      path: "courses.courseId",
      populate: { path: "instructorId", model: "auths" },
      select: "title price thumbnail instructorId",
    });
    res
      .status(200)
      .json({ message: "Removed from cart", success: true, data: newCart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

async function addToCartFromWishlist(studentId, courseId) {
  const course = await CourseModel.findOne({ _id: courseId }, { price: true });
  await WishlistModel.deleteOne({ studentId, courseId });
  return CartModel.updateOne(
    { studentId },
    {
      $addToSet: { courses: { courseId } },
      $inc: { totalPrice: course.price },
    },
    { upsert: true }
  );
}

const wishlistToCart = async (req, res) => {
  try {
    const { studentId } = req.body;

    // const studentId=req.user._id

    const wishlist = await WishlistModel.find({ studentId });
    if (wishlist.length < 1) {
      return res
        .status(404)
        .json({ message: "Wishlist empty", success: false });
    }
    const wishlistCourses = wishlist.map((value) =>
      addToCartFromWishlist(studentId, value.courseId)
    );
    const result = await Promise.all(wishlistCourses);
    res
      .status(200)
      .json({ message: "Moved wishlist to add to cart", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};


module.exports = { addToCart, removeFromCart, wishlistToCart, fetchCart };
