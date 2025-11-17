const mongoose=require('mongoose')
const CourseModel = require('./CourseModel')



const CartSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auths',
        required:true
    },
    courses:[
        {
            courseId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'courses',
                required:true
            }
        }
    ],
    totalPrice:{
        type:Number,
        default:0
    }
})




const CartModel=mongoose.model('cart',CartSchema)
module.exports=CartModel