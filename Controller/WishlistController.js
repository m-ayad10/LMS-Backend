const CourseModel = require("../Model/CourseModel")
const WishlistModel = require("../Model/WishlistModel")


const toggleWishlist=async(req,res)=>{
    try {
        const studentId=req.user.id
        const {courseId}=req.body
        // const {studentId,courseId}=req.body
        const isExist=await WishlistModel.findOne({studentId,courseId})
        if(!studentId || !courseId)
        {
            return res.status(400).json({message:"Bad request",success:false})
        }
        const course=await CourseModel.findOne({_id:courseId,status:'active'})
        if(!course)
        {
            return res.status(401).json({message:"Course is not active",success:false})
        }
        if(isExist)
        {
            await WishlistModel.deleteOne({studentId,courseId})
        }
        else{
            await WishlistModel.updateOne({studentId,courseId},{$setOnInsert:{studentId,courseId}},{upsert:true})
        }
        const wishlists=await WishlistModel.find({studentId}).populate('courseId')
        res.status(200).json({message:"Wishlist updated",success:true,data:wishlists})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}
const fetchWishlist=async(req,res)=>{
    try {
        const id=req.user.id
        // const {id}=req.params
        const wishlists=await WishlistModel.find({studentId:id}).populate('courseId')
        res.status(200).json({message:"Wishlist fetched",success:true,data:wishlists})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false})
    }
}

module.exports={toggleWishlist,fetchWishlist}