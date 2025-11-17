const cloudinary = require("cloudinary");
require("dotenv").config();
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

const uploadToCloudinary = async (filePath, option = {}) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      ...option,
    });
    fs.unlinkSync(filePath);
    return { success: true, result };
  } catch (error) {
    fs.unlinkSync(filePath);
    return { success: false, error };
  }
};

const deleteFromCloudinary=async(public_id,option={})=>{
  try {
    const result=await cloudinary.v2.uploader.destroy(public_id,option)
    return {result,success:true}
  } catch (error) {
    return {error,success:false}
  }
}

module.exports ={ uploadToCloudinary,deleteFromCloudinary}