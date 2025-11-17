const AuthModel = require("../Model/AuthModel")
const CartModel = require("../Model/CartModel")
const CourseModel = require("../Model/CourseModel")
const EnrollmentModel = require("../Model/EnrollmentModel")
const crypto=require('crypto')
const Razorpay = require("razorpay");
require('dotenv').config()

async function updateCourse(courseId,price){
    return CourseModel.updateOne({_id:courseId},{$inc:{totalStudents:1,revenue:price},})//add price to revenue
}
async function updateInstructor(instructorId,price) {
    return AuthModel.updateOne({_id:instructorId},{$inc:{revenue:price*0.7}})//add 70% price to intructor
}
async function  updateAdmin(price) {
    return AuthModel.updateOne({email:'admin@gmail.com'},{revenue:price*0.3})//add 30% price to admin
}

async function emptyCart(studentId)
{
    return CartModel.updateOne({studentId},{$set:{courses:[],totalPrice:0}})
}

const enrollCourse=async(req,res)=>{
    try {
        // const studentId=req.id
        // const {courseId}=req.params
        const {studentId,courseId}=req.body
        const isExist=await EnrollmentModel.findOne({studentId,courseId})

        const courseData=await CourseModel.findOne({_id:courseId},{price:true,instructorId:true})
        const {price,instructorId}=courseData
        
        if(isExist)
        {
            return res.status(409).json({message:"Course alldready enrolled",success:false})
        }
        const course=new EnrollmentModel({
            studentId,
            courseId,       
        })
        await Promise.all(
            [
            course.save(),
            updateAdmin(price),
            updateCourse(courseId,price),
            updateInstructor(instructorId,price)
        ])
        res.status(201).json({message:"Course enrollled",success:true})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

async function enrollToCourse(courseId,studentId){
    const isExist=await EnrollmentModel.findOne({studentId,courseId})

     if(isExist)
    {
        return {success:false,message:"Course alldready enrolled"}
    }
    const courseData=await CourseModel.findOne({_id:courseId},{price:true,instructorId:true})
    const {price,instructorId}=courseData
        
    const course=new EnrollmentModel({
            studentId,
            courseId,       
    })
    await Promise.all(
        [
            course.save(),
            updateAdmin(price),
            updateCourse(courseId,price),
            updateInstructor(instructorId,price)
    ])
    return {success:false , message:"Course enrolled"}
}



const enrollFromCart=async(req,res)=>{
    try {
        // const {studentId}=req.body
        const studentId=req.user.id
        const cart=await CartModel.findOne({studentId})
        if(cart.courses.length===0)
        {
            return res.status(404).json({message:"Cart is empty"})
        }
        const enrollCourse=cart.courses.map((value)=>{
            return enrollToCourse(value.courseId,studentId)
        })
        const results= await Promise.all([...enrollCourse,emptyCart(studentId)])

        const successfull=results.filter((value)=>value.success)
        const failed=results.filter((value)=>!value.success)

        const enrolled=await EnrollmentModel.find({studentId}).populate('courseId')
        const cartAfterEmpty=await CartModel.find({studentId})

        res.status(200).json({message:"Enrollment process completed",success:false,cart:cartAfterEmpty,data:enrolled,summary:{successfull,failed}})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

const enrolledByUser=async(req,res)=>{
    try {
        const id=req.user.id
        // const {id}=req.params
        const courses=await EnrollmentModel.find({studentId:id}).populate('courseId')
        res.status(200).json({message:"Fetched enrolled course by user",success:true,data:courses||[]})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

const addLessonToEnrolled=async(req,res)=>{
    try {
        const {id,index}=req.body;
        const Enrollment=await EnrollmentModel.findOne({_id:id}).populate('courseId')
        if(!Enrollment)
        {
            return res.status(404).json({message:"No enrollment found",success:false})
        }
        if(Enrollment.completedLesson.includes(index))
        {
            return res.status(409).json({message:"Lesson aldready completed",success:false})
        }
        Enrollment.completedLesson.push(index)
        Enrollment.progress=Math.min((Enrollment.completedLesson.length/Enrollment.courseId.totalLessons)*100,100)
        await Enrollment.save()
        res.status(200).json({message:"Lesson marked as completed",success:true,data:Enrollment})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}




const razorPay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const RazorpayOrder = async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: "receipt_order_" + Date.now(), // fixed typo here
      payment_capture: 1,
    };
    const razorPayOrder = await razorPay.orders.create(options);
    res.status(200).json({
      message: "Razorpay order created",
      status: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorPayOrder.id,
      amount: razorPayOrder.amount,
      currency: razorPayOrder.currency,
    });
  } catch (error) {
    console.log("Razorpay error:", error); // debug error
    res
      .status(500)
      .json({ message: "Internal server error", error, status: false });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Invalid signature", status: false });
    }
    res.status(200).json({ message: "Valid signature", status: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: false, error });
  }
};

module.exports={enrollCourse,enrolledByUser,enrollFromCart,addLessonToEnrolled,verifyPayment,RazorpayOrder}