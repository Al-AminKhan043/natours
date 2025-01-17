const express= require('express');
const app= express();
const sharp=require('sharp')
const multer=require('multer')
app.use(express.json());
const router= express.Router();
const User= require('../models/userModel');
const catchAsync=require('../utils/catchAsync')
const APIfeatures= require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory=require('./handleFactory')

// const multerStorage=multer.diskStorage({
//   destination: (req,file,cb)=>{
//     cb(null,'public/img/users')
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// });

const multerStorage=multer.memoryStorage();

multerFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }
  else {
    cb(new AppError('Not an Image, upload only image',400),false)
  }
}
const upload= multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.uploadUserPhoto=upload.single('photo')

exports.resizeUserPhoto= catchAsync(async (req,res,next)=>{
  if(!req.file) return next();
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
  next();
})

const filterObj=(obj,...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(e=>{
        if(allowedFields.includes(e)) newObj[e]=obj[e];
    })
    return newObj;
}



exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}



exports.getAllUsers=factory.getAll(User);

exports.updateMe=catchAsync(async (req,res,next)=>{
  
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('Cant change password here',400))
  }
  const filteredBody= filterObj(req.body,'name','email');
  
  if(req.file) filteredBody.photo=req.file.filename;
  const user=await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true});
  
  res.status(200).json({
    status:'success',
    data:{
        user
    }
  })
})

exports.deleteMe= catchAsync(async(req,res,next)=>{
   const user= await User.findByIdAndUpdate(req.user.id, {active:false})
   res.status(204).json({
    status:'success',
    data:null
   })
} )

exports.getUser=factory.getOne(User);

exports.createUser= (req,res)=>{
    res.status(500).json({
        status:'error',
        message: 'this route is not yet defined! Please use signup!'
    })
}

// do not update password with this
exports.patchUser=factory.updateOne(User);

exports.deleteUser= factory.deleteOne(User);
