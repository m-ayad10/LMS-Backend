const mongoose=require('mongoose')

const ReviewSchema=mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courses",
        required:true
    },
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"auths",
        required:true
    },
    star:{
        type:Number,
        required:true
    },
    message:{
        type:String
    }
},{timestamps:true})

const ReviewModel=mongoose.model('reviews',ReviewSchema)

module.exports=ReviewModel