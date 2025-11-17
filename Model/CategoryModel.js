const mongoose=require('mongoose')

const CategorySchema=new mongoose.Schema({
    name:{
        type:String,
        reuired:true,
        unique:true,
        index:true
    },
    url:{
        type:String,
        required:true,
    }
})

const CategoryModel=mongoose.model('categories',CategorySchema)

module.exports= CategoryModel