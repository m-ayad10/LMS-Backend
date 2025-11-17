const { AuthLogin, verifyOTP, verifyToken, logOut } = require('../Controller/AuthController')
const { LoginValidation, StudentMiddleware } = require('../Middleware/StudentMiddleware')

const router=require('express').Router()


router.post('/verify-otp',verifyOTP)
router.get('/verify-token',verifyToken)
router.post('/login',LoginValidation,AuthLogin)
router.post('/logout',StudentMiddleware,logOut)

module.exports=router