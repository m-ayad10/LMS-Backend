const { addToCart, removeFromCart, fetchCart, RazorpayOrder, verifyPayment } = require('../Controller/CartController')
const { StudentMiddleware } = require('../Middleware/StudentMiddleware')

const router=require('express').Router()

// router.patch('/addToCart',addToCart)
// router.patch('/removeFromCart',removeFromCart)
// router.get('/:id',fetchCart)

router.get('/',StudentMiddleware,fetchCart)
router.patch('/addToCart',StudentMiddleware,addToCart)
router.patch('/removeFromCart',StudentMiddleware,removeFromCart)
router.patch('/removeFromCart',StudentMiddleware,removeFromCart)



module.exports=router