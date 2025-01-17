const Tour= require('../models/tourModel');
const Review=require('../models/reviewModel');
const catchAsync=require('../utils/catchAsync')
const User=require('../models/userModel')
const AppError = require('../utils/appError');
const Booking=require('../models/bookingModel')

exports.getOverview= catchAsync(async(req,res,next)=>{
    
    const tours= await Tour.find();
    
    res.status(200).render('overview',{
        title: 'All Tours',
        tours
    })
})

exports.getTour=catchAsync(async(req,res,next)=>{
    
    const tour= await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        select:'review rating user'
    })
if(! tour)
    {return next (new AppError('There is no tour with that name',404))
    }

    res.status(200)
    .set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      )
    .render('tour',{
        title: tour.name,
        tour
    })
})

exports.login = catchAsync(async (req, res, next) => {
    console.log("In login route");
    res.status(200).render('login', {
      title: 'Log into your account'
    });
});


exports.getAccount= (req,res)=>{
    res.status(200).render('account', {
        title: 'Your Account'
      });
}  

exports.updateUserData=async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.user.id,{
        name:req.body.name,
        email:req.body.email
    },
{
    new:true,
    runValidators:true
}
);

res.status(200).render('account', {
    title: 'Your Account',
    user
  });

}

exports.getMyTours= catchAsync(async(req,res,next)=>{
    const bookings= await Booking.find({user:req.user.id})
    const tourIds=bookings.map(e=> e.tour )
    const tours= await Tour.find({_id:{$in: tourIds}})
    res.status(200).render('overview',{
      title: 'My Tours',
      tours  
    })
})