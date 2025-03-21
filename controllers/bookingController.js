const express=require('express')
const Review=require('../models/reviewModel')
const catchAsync=require('../utils/catchAsync')
const APIfeatures= require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const Tour= require('../models/tourModel');
const User=require('../models/userModel');
const Booking=require('../models/bookingModel');
const factory=require('./handleFactory')
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const app= express();
app.use(express.json());

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        
        // success_url: `${req.protocol}://${req.get('host')}/my-tours`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`${req.protocol}://${req.get('host')}//img/tours/${tour.imageCover}`], // Ensure HTTPS
                    },
                    unit_amount: tour.price * 100, // Price in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment', // Required for a one-time payment session
    });
    // console.log(session);
    res.status(200).json({
        status: 'success',
        session
    });
});


exports.createBookingCheckout= catchAsync(async(req,res,next)=>{
    const {tour,user,price}=req.query;
    if(!tour && !user && !price) return next();
    
    await Booking.create({tour,user,price})
    res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking=factory.createOne(Booking);
exports.getBooking=factory.getOne(Booking);
exports.getAllBooking=factory.getAll(Booking);
exports.updateBooking=factory.updateOne(Booking);
exports.deleteBooking=factory.deleteOne(Booking);


// const createBookingCheckout=async (session)=>{
//     const tour=session.client_reference_id;
//     const user=(await User.findOne({email:session.customer_email})).id;
//     const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
//     const price = lineItems.data[0].amount_total / 100;
//     console.log(tour, user,price);
//     await Booking.create({tour,user,price})
// }

// exports.webhookheckout=(req,res,next)=>{
//     const signature=req.headers['stripe-signature'];
//     let event;
//     try{
//      event= stripe.webhooks.constructEvent(req.body,signature,process.env.STRIPE_WEBHOOK_SECRET)
//     }
//     catch(e){
//         return res.status(400).send(`Webhook Error:${e.message}`)
//     }

//     if(event.type==='checkout.session.completed'){
//         createBookingCheckout(event.data.object);
        
//     }
//     res.status(200).json({received:true})
// }