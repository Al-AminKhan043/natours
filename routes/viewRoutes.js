const express= require('express')
const router=express.Router();
const viewsController=require('../controllers/viewController')
const authController=require('../controllers/authController')
const bookingController=require('../controllers/bookingController')
router.use(authController.isLoggedIn);

router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewsController.getOverview);

router.get('/tour/:slug',viewsController.getTour);

router.get('/login',viewsController.login);

router.get('/me',authController.protect,viewsController.getAccount)

router.get('/my-tours',authController.protect,viewsController.getMyTours)

router.post('/submit-user-data',authController.protect,viewsController.updateUserData)

module.exports=router;