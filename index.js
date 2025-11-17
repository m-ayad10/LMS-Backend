const express=require('express')
const app=express()
const cors=require('cors')
const cookieParser=require('cookie-parser')
require('./db')
require('dotenv').config()

const PORT=process.env.PORT

app.listen(PORT,(err)=>{
    if(err)
    {
        console.error("Error connecting to server", err)
    }
    else{
        console.log("Server connected at port no: ",PORT)
    }
})
app.use(cors({
    origin:'http://localhost:5173',
    methods:'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const studentRoute=require('./Routes/StudentRoutes')
const instructorRoute=require('./Routes/IntructorRoutes')
const adminRoute=require('./Routes/AdminRoutes')
const wishlistRoute=require('./Routes/WishlistRoutes')
const enrollmentRoute=require('./Routes/EnrolledRoutes')
const reviewRoute=require('./Routes/ReviewRoutes')
const categoryRoute=require('./Routes/CategoryRoutes')
const cartRoute=require('./Routes/CartRoutes')
const authRoute=require('./Routes/AuthRoutes')
const courseRoute=require('./Routes/CourseRoutes')

app.use('/course',courseRoute)
app.use('/',authRoute)
app.use('/student',studentRoute)
app.use('/instructor',instructorRoute)
app.use('/admin',adminRoute)
app.use('/wishlist',wishlistRoute)
app.use('/enrollment',enrollmentRoute)
app.use('/review',reviewRoute)
app.use('/category',categoryRoute)
app.use('/cart',cartRoute)
