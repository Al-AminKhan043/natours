const express= require('express');
const app= express();
app.use(express.json());
const router= express.Router();
const fs=require('fs');
const tourController=require('../controllers/tourController');
const authController=require('../controllers/authController')
const reviewController=require('../controllers/reviewController')
const reviewRouter=require('./reviewRoutes')

// router.param('id',tourController.checkID)

router.use('/:tourId/reviews',reviewRouter)

router.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getAllTours)

router.route('/tour-stat')
.get(tourController.getTourStats)

router.route('/monthly-plan/:year')
.get(authController.protect, authController.restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan)

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getToursWithin)
router.route('/distances/:latlng/unit/:unit')
.get(tourController.getDistances)

router.route('/')
.get(tourController.getAllTours)
.post(authController.protect, authController.restrictTo('admin','lead-guide'), tourController.createTour)

router.route('/:id')
.get(tourController.getTour)
.patch(authController.protect, authController.restrictTo('admin','lead-guide'),tourController.uploadTourImages,tourController.resizeTourImages,tourController.patchTour)
.delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour)

module.exports= router;