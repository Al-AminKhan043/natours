const express= require('express');
const app= express();
app.use(express.json());
const router= express.Router();
const fs=require('fs');
const tourController=require('../controllers/tourController');
const authController=require('../controllers/authController');
const reviewController=require('../controllers/reviewController');
const bookingController=require('../controllers/bookingController')

router.use(authController.protect);

router.get('/checkout-session/:tourId',bookingController.getCheckoutSession)

router.use(authController.restrictTo('admin','lead-guide'))

router.route('/')
.get(bookingController.getAllBooking)
.post(bookingController.createBooking)

router.route('/:id')
.get(bookingController.getBooking)
.patch(bookingController.updateBooking)
.delete(bookingController.deleteBooking)

module.exports=router;