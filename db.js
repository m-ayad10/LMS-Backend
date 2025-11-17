const mongoose=require('mongoose')
require('dotenv').config()

const MONGO_URL=process.env.MONGO_URL
mongoose.connect(MONGO_URL)

const db=mongoose.connection

db.on('connected',()=>
{
    console.error("MongoDB connected")
})

db.on('disconnected',()=>{
    console.log("MongoDB disconnected")
})

db.on('error',(error)=>{
    console.error("MongoDb connection error:", error)
})

module.exports=db