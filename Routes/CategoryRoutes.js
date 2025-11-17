const { fetchAllCategories, addCategory, updateCategory, DeleteCategory, getCategory } = require('../Controller/CategoryController')
const { AdminMiddleware } = require('../Middleware/AdminMiddleware')
const { InstructorMiddleware } = require('../Middleware/InstructorMiddleware')
const { imageUpload } = require('../multer/uploadMiddleware')

const router=require('express').Router()

// router.get('/',fetchAllCategories)
// router.post('/',imageUpload.single('image'),addCategory)
// router.patch('/',imageUpload.single('image'),updateCategory)
// router.delete('/:id',DeleteCategory)


router.get('/',fetchAllCategories)
router.post('/',AdminMiddleware,imageUpload.single('image'),addCategory)
router.patch('/',AdminMiddleware,imageUpload.single('image'),updateCategory)
router.delete('/:id',AdminMiddleware,DeleteCategory)
router.get('/:id',AdminMiddleware,getCategory)

module.exports=router