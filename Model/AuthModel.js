const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const AuthSchema=new mongoose.Schema({
    firstName:{
        type:String,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        index:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    profile:{
        type:String,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    revenue:{
        type:Number,
    },
    role:{
        type:String,
        enum:['admin','student','instructor']
    },
    bio:{
        type:String
    },
    verificationToken:{
        type:String
    },
    tokenExpiry:{
        type:Date
    },
    totalCourses:{
        type:Number
    },
    isVerified:{
        type:Boolean
    }
},{timestamps:true})

AuthSchema.pre('save',async function(next){
    if(this.isModified('password'))
    {
        this.password=await bcrypt.hash(this.password,10)
    }
    next()
})


const AuthModel=mongoose.model('auths',AuthSchema)

module.exports=AuthModel