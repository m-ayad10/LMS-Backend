const { adminSignUp, getAdminDashboard, userActivateToggle } = require('../Controller/AdminController')
const { AuthLogin, fetchAuth, changePassword, verifyToken } = require('../Controller/AuthController')
const { updateIntructorActive } = require('../Controller/InstructorController')
const { adminSignUpValidation, AdminMiddleware } = require('../Middleware/AdminMiddleware')
const { passwordValidation } = require('../Middleware/AuthMiddleware')
const { LoginValidation } = require('../Middleware/StudentMiddleware')

const router=require('express').Router()

// router.post('/register',adminSignUpValidation,adminSignUp)
// router.get('/:id',fetchAuth)
// router.patch('/change-password/:id',passwordValidation,changePassword)
// router.patch('/instructor-active',updateIntructorActive)
// router.get('/dashboard',getAdminDashboard)


router.post('/register',adminSignUpValidation,adminSignUp)
router.patch('/change-password',AdminMiddleware,passwordValidation,changePassword)
// router.patch('/instructor-active',AdminMiddleware,updateIntructorActive)
router.get('/dashboard',AdminMiddleware,getAdminDashboard)
router.patch('/activate-toggle/:id',AdminMiddleware,userActivateToggle)
router.get('/:id',AdminMiddleware,fetchAuth)
router.get('/verify-token',AdminMiddleware,verifyToken)



module.exports=router