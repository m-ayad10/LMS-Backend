const { uploadReview, updateReview, fetchAllReviews, deleteReview } = require('../Controller/ReviewController')
const { StudentMiddleware } = require('../Middleware/StudentMiddleware')

const router=require('express').Router()

// router.post('/',uploadReview)
// router.patch('/',updateReview)
// router.get('/',fetchAllReviews)
// router.delete('/',deleteReview)

router.post('/',StudentMiddleware,uploadReview)
router.patch('/',StudentMiddleware,updateReview)
router.delete('/',StudentMiddleware,deleteReview)
router.get('/:courseId',fetchAllReviews)


module.exports=router