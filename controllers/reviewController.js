const express=require('express')
const Review=require('../models/reviewModel')
const catchAsync=require('../utils/catchAsync')
const APIfeatures= require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory=require('./handleFactory')
const app= express();
app.use(express.json());



exports.getAllReviews=factory.getAll(Review);

exports.setTourUserIds=(req,res,next)=>{
    if(! req.body.tour) req.body.tour=req.params.tourId
    if(!req.body.user) req.body.user=req.user.id;
    next();
}

exports.getReview=factory.getOne(Review);

exports.createReview=factory.createOne(Review);

exports.updateReview=factory.updateOne(Review);

exports.deleteReiew=factory.deleteOne(Review);