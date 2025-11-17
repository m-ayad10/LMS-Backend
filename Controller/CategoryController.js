const { uploadToCloudinary } = require("../Cloudinary/cloudinary")
const CategoryModel = require("../Model/CategoryModel")

const getAllCategories=async()=>{
   return await CategoryModel.find().sort({name:1})
}

CategoryModel.schema.index({name:1},{unique:true})

const addCategory=async(req,res)=>{
    try {
        const {name}=req.body

        if(!name.trim())
        {
            return res.status(400).json({message:"Category name required",success:false})
        }
        const image=req.file
        if(!image)
        {
            return res.status(400).json({message:"Category image required",success:false})
        }
        const isExist=await CategoryModel.findOne({name})
        if(isExist)
        {
            return res.status(409).json({message:"Category aldready exist",success:false})
        }

        const {success,result,error}=await uploadToCloudinary(image.path,{folder:"Course category"})
        if(!success)
        {
            return res.status(500).json({message:"Failed to upload image",success:false,error})
        }
        const category=await CategoryModel.create({name:name.trim(),url:result.secure_url})
        res.status(201).json({message:"Category added",data:category,success:true})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

const fetchAllCategories=async(req,res)=>
{
    try {
        res.status(200).json({message:"All categories fetched",data:await getAllCategories()||[],success:true})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

const DeleteCategory=async(req,res)=>{
    try {
        const {id}=req.params
        console.log(id)
        await CategoryModel.deleteOne({_id:id})
        res.status(200).json({message:"Category deleted successfully",success:true})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

const updateCategory=async(req,res)=>{
    try {
        // const {id}=req.params
        const {name,categoryId:id}=req.body;
        const updateData={}
        if(name?.trim())
        {
            updateData.name=name
        }
        if(req.file)
        {
            const {success,error,result}=await uploadToCloudinary(req.file.path,{
                folder:"Course category"
            })
            if(!success)
            {
               return res.status(500).json({message:"Internal server error",success:false,error})
            }
            updateData.url=result.secure_url
        }
        const category=await CategoryModel.findByIdAndUpdate(id,{$set:updateData},{new:true})
        res.status(200).json({message:"Category updated",success:true,data:category})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

const getCategory=async(req,res)=>{
    try {
        const {id}=req.params
        const category=await CategoryModel.findById(id)
        if(!category)
        {
            return res.status(404).json({message:"Category not found",success:false})
        }
        res.status(200).json({message:"Category found",success:true,data:category})
    } catch (error) {
        res.status(500).json({message:"Internal server error",success:false,error})
    }
}

module.exports={updateCategory,addCategory,DeleteCategory,fetchAllCategories,getCategory}