const express= require('express');
const app= express();
app.use(express.json());
const router= express.Router({mergeParams:true});
const fs=require('fs');
const tourController=require('../controllers/tourController');
const authController=require('../controllers/authController');
const reviewController=require('../controllers/reviewController');

router
.use(authController.protect)

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('user'),reviewController.setTourUserIds,reviewController.createReview);

router.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('user','admin'),reviewController.updateReview)
.delete(authController.restrictTo('user','admin'),reviewController.deleteReiew)

module.exports=router;