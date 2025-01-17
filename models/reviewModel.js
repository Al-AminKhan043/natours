const mongoose = require('mongoose');
const Tour= require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have a body']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({tour:1, user:1},{unique:true})


reviewSchema.pre(/^find/, async function(next){
     this.populate({
        path:'user',
        select: '-__v -passwordChangedAt'
    })
    // this.populate({
    //     path:'tour',
    //     select:'name'

    // })
    next();
})

reviewSchema.pre('save',async function(next){
   await this.populate({
        path:'user',
        select: '-__v -passwordChangedAt'
    })
  //  await this.populate({
  //       path:'tour',
  //       select:'name'

  //   })
    next();
})

reviewSchema.statics.calcAverageRatings=async function(tourId){
 const stats= await this.aggregate([
  {  $match:{tour:tourId}
  },
  {
    $group:{
      _id:'$tour',
      nRating: {$sum:1},
      avgRating:{$avg:'$rating'}
    }
  }
  ])
  // console.log(stats);
  if(stats.length >0){
    await Tour.findByIdAndUpdate(tourId,{ ratingsAverage:stats[0].avgRating,ratingsQuantity:stats[0].nRating})
  }
 else {
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity:0,
  ratingsAverage:1
  })
  }
}
reviewSchema.post('save',function(){
  //this points to the current document, means current review
  
  this.constructor.calcAverageRatings(this.tour);
 
})

reviewSchema.pre(/^findOneAnd/, async function(next){
  this.r = await this.model.findOne(this.getQuery());
  // console.log(this.r);
  next();
})

reviewSchema.post(/^findOneAnd/, async function(){
 await this.r.constructor.calcAverageRatings(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
