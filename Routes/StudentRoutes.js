const { SignUpValidation, LoginValidation, StudentMiddleware } = require('../Middleware/StudentMiddleware')
const {studentSignUp,updateStudent}= require('../Controller/StudentController')
const {changePassword,fetchAuth, AuthLogin,}=require('../Controller/AuthController')
const router=require('express').Router()
const { imageUpload } = require('../multer/uploadMiddleware')
const { passwordValidation } = require('../Middleware/AuthMiddleware')



// router.post('/register',imageUpload.single('profile'),SignUpValidation,studentSignUp)
// router.post('/login',LoginValidation,AuthLogin)
// router.patch('/:id',imageUpload.single('profile'),updateStudent)
// router.get('/:id',fetchAuth)
// router.patch('/change-password/:id',passwordValidation,changePassword)


router.post('/register',imageUpload.single('profile'),SignUpValidation,studentSignUp)
router.post('/login',LoginValidation,AuthLogin)
router.patch('/',StudentMiddleware,imageUpload.single('profile'),updateStudent)
router.get('/',StudentMiddleware,fetchAuth)
router.patch('/change-password',StudentMiddleware,passwordValidation,changePassword)

module.exports=router