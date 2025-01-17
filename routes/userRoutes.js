const express= require('express');
const app= express();
const multer=require('multer')

app.use(express.json());
const router= express.Router();
const userController=require('../controllers/userController');
const authController=require('../controllers/authController');

router
.post('/signup',authController.signup)
.post('/login',authController.login)

router.get('/logout',authController.logout);

router
.post('/forgotPassword',authController.forgotPassword)
.patch('/resetPassword/:token',authController.resetPassword)


router
.use(authController.protect);

router
.patch('/updatePassword',authController.updatePassword)



router
.delete('/deleteMe',  userController.deleteMe)

router
.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto ,userController.updateMe)

router
.get('/me', userController.getMe,userController.getUser)

router
.use(authController.restrictTo('admin'))

router.route('/')
.get(userController.getAllUsers)
.post(userController.createUser)

router.route('/:id')
.get(userController.getUser)
.patch(userController.patchUser)
.delete(userController.deleteUser)

module.exports=router;