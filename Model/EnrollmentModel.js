const mongoose =require('mongoose')

const EnrollmentSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auths',
        index:true,
        required:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'courses',
        index:true,
        required:true
    },
    completedLesson:{
        type:[Number],
        default:[]
    },
    progress:{
        type:Number,
        default:0
    }
},{timestamps:true})

const EnrollmentModel=mongoose.model('enrollment',EnrollmentSchema)
module.exports=EnrollmentModel