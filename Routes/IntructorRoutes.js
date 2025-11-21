const { AuthLogin, changePassword, fetchAuth, verifyToken } = require('../Controller/AuthController')
const { instructorSignUp, updateIntructor, getDashboardDetails } = require('../Controller/InstructorController')
const { passwordValidation } = require('../Middleware/AuthMiddleware')
const { instructorLoginValidation, instructorSignUpValidation, InstructorMiddleware } = require('../Middleware/InstructorMiddleware')
const { imageUpload } = require('../multer/uploadMiddleware')
const router=require('express').Router()


// router.post('/login',instructorLoginValidation,AuthLogin)
// router.post('/register',instructorSignUpValidation,imageUpload.single('profile'),instructorSignUp)
// router.patch('/:id',imageUpload.single('profile'),updateIntructor)
// router.patch('/change-password/:id',passwordValidation,changePassword)
// router.get('/:id',fetchAuth)

router.post('/login',instructorLoginValidation,AuthLogin)
router.post('/register',instructorSignUpValidation,imageUpload.single('profile'),instructorSignUp)
router.patch('/',InstructorMiddleware,imageUpload.single('profile'),updateIntructor)
router.patch('/change-password',InstructorMiddleware,passwordValidation,changePassword)
router.get('/dashboard',InstructorMiddleware,getDashboardDetails)
router.get('/',InstructorMiddleware,fetchAuth)
router.get('/verify-token',InstructorMiddleware,verifyToken)


    
module.exports=router