const mongoose=require('mongoose')

const WishlistSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auths',
        required:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'courses',
        required:true
    }
})

const WishlistModel=mongoose.model('wishlists',WishlistSchema)

module.exports=WishlistModel