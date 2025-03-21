// const {promisify}=require('util');
// const User= require('../models/userModel');
// const catchAsync=require('../utils/catchAsync')
// const jwt=require('jsonwebtoken');
// const AppError= require('../utils/appError')
// const Email= require('../utils/email')
// const crypto=require('crypto')



// const signToken=id=>{
//     return jwt.sign({
//         id
//     },
//     process.env.JWT_SECRET,
//     {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     }
// )
// }


// const createSendToken= (user,statusCode,res)=>{
//     const token=signToken(user._id);
//     const cookieOptions={
//         expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
//         // secure: true,
//         httpOnly:true
//     }
//     if(process.env.NODE_ENV==='production') cookieOptions.secure=true
//     res.cookie('jwt',token,cookieOptions)
//     user.password=undefined;
//     res.status(statusCode).json({
//         status:'success',
//         token,
//         data:{
//             user
//         }
//     })
// }

// exports.signup= catchAsync(async (req,res,next)=>{
//     const newUser= await User.create({
//         name:req.body.name,
//         email:req.body.email,
//         password:req.body.password,
//         passwordConfirm:req.body.passwordConfirm,
//         passwordChangedAt:req.body.passwordChangedAt,
//         role:req.body.role
//     })
//     const url=`${req.protocol}://${req.get('host')}/me`;
//     // console.log(url);
//     await new Email(newUser,url).sendWelcome();
//     createSendToken(newUser,201,res);
// })

// exports.login= catchAsync(async(req,res,next)=>{
//     const {email,password}=req.body;
//     if(! email || !password){
//     return next( new AppError('Please provide email and password!',400))
//     }
//     const user= await User.findOne({email}).select('+password');
    
//     if(!user || !(await user.correctPassword(password,user.password))){
//         return next(new AppError('Incorrect email or password',401));
//     }
//     createSendToken(user,200,res);
// })

// exports.logout = (req, res) => {
//     res.cookie('jwt', 'logged out', {
//       expires: new Date(Date.now() + 10 * 1000),
//       httpOnly: true
//     });
//     res.status(200).json({ status: 'success' });
//   };






// exports.protect=catchAsync(async(req,res,next)=>{
//     let token;
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//     token= req.headers.authorization.split(' ')[1]   
//     }
//     else if (req.cookies.jwt){
//         token=req.cookies.jwt;
//     }
    
//     if(!token){
//         return next(new AppError('You are not logged in! Please login to access',401))
//     }


//    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
//    const freshUser= await User.findById(decoded.id)
//    if(!freshUser){
//     return next(new AppError('The user of the token no longer exists',401));
//    }
//    if(freshUser.changedPasswordAfter(decoded.iat)){
//     return next(new AppError ('User recently changed password, login again!',401));
//    }
//    req.user=freshUser;
//    res.locals.user=freshUser;
//     next();
// })

// exports.restrictTo= (...roles)=>{
//     return(req,res,next)=>{
//         if(!roles.includes(req.user.role)){
//             return next(new AppError ('You do not have permission to perform this action',403))
//         }
//         next();
//     }

// }

// exports.forgotPassword= async(req,res,next)=>{
// const user= await User.findOne({email: req.body.email});
// if (! user){
//     return next(new AppError('There is no user with this email',404));
// }
// const resetToken= user.createPasswordResetToken();
// await user.save({validateBeforeSave:false});
// try{
// const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
// // const message= `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\n If you didnt foget your password,please ignore this email!`;
// // await sendEmail({
// //     email: user.email,
// //     subject: 'Your password reset token (valid for 10 mins)',
// //     message
// // })
// await new Email(user,resetURL).passwordReset();

// res.status(200).json({
//    status: 'success',
//    message: 'Token sent to email!' 
// })
// }
// catch(e){
//     user.passwordResetToken= undefined;
//     user.passwordResetExpires= undefined;
//     await user.save({validateBeforeSave:false});
//     return next( new AppError('There was an error sending the email. Try again!',500))
// }
// }

// exports.resetPassword= catchAsync(async(req,res,next)=>{
// const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
// const user= await User.findOne({passwordResetToken:hashedToken, passwordResetExpires:{$gt: Date.now()}})

// if(! user){
//     return next (new AppError('Token is invalid or has expired!',400));

// }
// user.password=req.body.password;
// user.passwordConfirm=req.body.passwordConfirm;
// user.passwordResetToken=undefined;
// user.passwordResetExpires=undefined;
// await user.save();
// createSendToken(user,200,res);

// });

// exports.updatePassword=catchAsync(async(req,res,next)=>{
//     const user=await User.findById(req.user.id).select('+password');
//     if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
//         return next(new AppError('your current password is wrong',401))

//     }
//     user.password=req.body.password;
//     user.passwordConfirm=req.body.passwordConfirm;
//     await user.save();
//     createSendToken(user,200,res);
// })


// exports.isLoggedIn=async(req,res,next)=>{
    
//     if (req.cookies.jwt){
        
//     try{
    

//    const decoded=await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
//    const freshUser= await User.findById(decoded.id)
//    if(!freshUser){
//     return next()
//    }
//    if(freshUser.changedPasswordAfter(decoded.iat)){
//     return next();
//    }
//    res.locals.user=freshUser
//  return next();
// }
// catch(e){
//     return next();
// }
// }
// next();
// }

// // exports.protectTour = (req, res, next) => {
// //     if (!res.locals.user) {
// //         return res.redirect('/login'); // Redirect to login page if no user found in locals
// //     }
// //     next(); // If user is logged in, allow the request to proceed
// // };





const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');  // Use bcryptjs instead of bcrypt

const signToken = (id) => {
  return jwt.sign(
    {
      id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   const cookieOptions = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//     httpOnly: true
//   };
//   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
//   res.cookie('jwt', token, cookieOptions);
//   user.password = undefined;  // Don't send the password in the response
//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user
//     }
//   });
// };


const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, req,res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  
  // Use bcryptjs to compare the password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, req,res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];   
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please login to access', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user of the token no longer exists', 401));
  }
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password, login again!', 401));
  }
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).passwordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req,res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, req,res);
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = freshUser;
      return next();
    } catch (e) {
      return next();
    }
  }
  next();
};
