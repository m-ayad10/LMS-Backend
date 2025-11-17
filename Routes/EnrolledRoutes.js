const { enrollCourse, enrolledByUser, enrollFromCart, addLessonToEnrolled, RazorpayOrder, verifyPayment } = require('../Controller/EnrollmentController')
const { StudentMiddleware } = require('../Middleware/StudentMiddleware')
const router=require('express').Router()

// router.post('/',enrollFromCart)
// router.get('/:id',enrollCourse)
// router.get('/:id',enrolledByUser)

router.post('/',StudentMiddleware,enrollFromCart)
router.get('/',StudentMiddleware,enrolledByUser)
router.patch('/complete-lesson',StudentMiddleware,addLessonToEnrolled)

router.post('/create-razorpay-order',StudentMiddleware, RazorpayOrder)
router.post('/verify-payment',StudentMiddleware, verifyPayment)


module.exports=router