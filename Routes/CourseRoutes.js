const { addCourse, deleteCourse, fetchAllCourse, fetchCourse, toggleArchieveCourse } = require('../Controller/CourseController')
const { InstructorMiddleware } = require('../Middleware/InstructorMiddleware')
const { StudentMiddleware } = require('../Middleware/StudentMiddleware')
const { courseUpload, imageUpload } = require('../multer/uploadMiddleware')

const router=require('express').Router()

router.post('/:id',courseUpload,addCourse)
// router.patch('/delete/:id',deleteCourse)
// router.get('/',fetchAllCourse)
// router.get('/:id',fetchCourse)
// router.patch('/toggleArchieve/:id',toggleArchieveCourse)


router.post('/',InstructorMiddleware,courseUpload,addCourse)
router.delete('/:id',InstructorMiddleware,deleteCourse)
router.get('/',fetchAllCourse)
router.get('/:id',fetchCourse)
router.patch('/toggleArchieve/:id',InstructorMiddleware,toggleArchieveCourse)

module.exports=router