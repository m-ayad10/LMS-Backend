const {uploadToCloudinary, deleteFromCloudinary} = require("../Cloudinary/cloudinary");
const AuthModel = require("../Model/AuthModel");
const CourseModel = require("../Model/CourseModel");

const uploadImage=(filePath)=>uploadToCloudinary(filePath,{folder:"Course thumbnail"})

const uploadVideo=(filePath)=>uploadToCloudinary(filePath,{
  resource_type:"video",
  chunk_size:3000000,
  folder:"Course video"}
)

const addCourse = async (req, res) => {
  try {
    // const {id}=req.params
    // console.log(id)
    const id=req.user.id
    const { title, description, category, level, isPaid, price, name } =
      req.body;
    let thumbnail = req.files?.thumbnail[0];
    let previewVideo = req.files?.previewVideo[0];
    const lessons = req.files?.lesson||[];

    const [thumbnailRes,previewVideoRes]=await Promise.all([
      thumbnail?uploadImage(thumbnail.path):null,
      previewVideo?uploadVideo(previewVideo.path):null
    ])
    thumbnail=thumbnailRes?.success?thumbnailRes.result.secure_url:null
    previewVideo=previewVideoRes?.success?previewVideoRes.result.secure_url:null
    const nameArray=name instanceof Array?name:[name]
    const lessonsArray=lessons instanceof Array?lessons:[lessons]

    const lessonUploads=await Promise.all(
      lessonsArray.map((value,index)=>{
        return uploadVideo(value.path)
      })
    )

    const curiculum=lessonUploads.map((value,index)=>{
      return value.success?{
        url:value.result.secure_url,
        public_id:value.result.public_id,
        sectionName:nameArray[index]
      }:null
    }).filter(Boolean)
    
    const course = new CourseModel({
      instructorId:id,
      totalLessons:lessons.length,  
      title,
      description,
      category,
      level,
      isPaid,
      price,
      curiculum,
      thumbnail,
      previewVideo:previewVideo
    });
    await course.save()
    res.status(201).json({message:"Course created",success:true,data:course})
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false ,error});
  }
};

const toggleArchieveCourse=async(req,res)=>{
  try {
    const {id}=req.params
    const instructorId=req.user.id
    const course=await CourseModel.findOne({_id:id})
    if(!course)
    {
      return res.status(404).json({message:"Course not found",success:false})
    }
    if(course.status==='active')
    {
       await CourseModel.updateOne({_id:id},{$set:{
      status:'archieved'
    }})
    }
    else{
      await CourseModel.updateOne({_id:id},{$set:{
        status:'active'
      }})
    }
    const courses=await CourseModel.find({instructorId}).populate('instructorId')
    res.status(200).json({message:"Course toggle Archieve successfully",success:true,data:courses})
  } catch (error) {
    res.status(500).json({message:"Internal server error",success:false,error})
  }
}

const deleteCourse=async(req,res)=>{
  try {
    const {id}=req.params
    const course=await CourseModel.findOne({_id:id})
    if(!course)
    {
      return res.status(404).json({message:"Course not found",success:false})
    }
    await CourseModel.updateOne({_id:id},{$set:{
      status:'deleted'
    }})
    const courses=await CourseModel.find({status:'active'}).populate('instructorId')
    res.status(200).json({message:"Course deleted successfully",success:true,data:courses})
  } catch (error) {
    res.status(500).json({message:"Internal server error",success:false,error})
  }
}

const fetchAllCourse=async(req,res)=>{
  try {
    const courses=await CourseModel.find({status:'active'}).populate('instructorId')
    res.status(200).json({message:"Fetched all courses",success:true,data:courses})
  } catch (error) {
    res.status(500).json({message:"Internal server error",success:false})
  }
}

const fetchCourse=async(req,res)=>{
  try {
    const {id}=req.params
    const course=await CourseModel.findOne({_id:id,status:'active'}).populate('instructorId')
    if(!course)
    {
      return res.status(404).json({message:"Course not found",success:false})
    }
    res.status(200).json({message:"Course found",success:true,data:course})
  } catch (error) {
    res.status(500).json({message:"Internal server error",success:false,error})
  }
}



module.exports = { addCourse ,deleteCourse,fetchAllCourse,fetchCourse,toggleArchieveCourse};
