const { toggleWishlist, fetchWishlist } = require('../Controller/WishlistController')
const { StudentMiddleware } = require('../Middleware/StudentMiddleware')

const router=require('express').Router()

// router.post('/',toggleWishlist)
// router.get('/:id',fetchWishlist)


router.post('/',StudentMiddleware,toggleWishlist)
router.get('/',StudentMiddleware,fetchWishlist)

module.exports=router