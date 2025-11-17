const mongoose=require('mongoose')


const SectionSchema=new mongoose.Schema({
    sectionName:{
        type:String,
        required:true,
        trim:true
    },
   url:{
    type:String,
    required:true
   },
   public_id:{
    type:String
   }
},{_id:false})



const CourseSchema=new mongoose.Schema({
    instructorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auths',
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        index:true
    },
    level:{
        type:String,
        enum:['Beginner' ,'Intermediate','Advanced'],
        required:true
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    price:{
        type:Number,
        default:0
    },
    thumbnail:{
        type:String,
        required:true
    },
    previewVideo:{
        type:String,
        required:true
    },
    curiculum:{
        type:[SectionSchema],
        default:[]
    },
    totalLessons:{
        type:Number,
        default:0
    },
    totalStudents:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        required:true,
        enum:['active','archieved','deleted'],
        default:'active'
    },
    revenue:{
        type:Number,
        default:0
    },
    totalRatings:{
        type:Number
    },
    totalNoOfRating:{
        type:Number
    }
    
},{timestamps:true})


const CourseModel=mongoose.model('courses',CourseSchema)
module.exports=CourseModel