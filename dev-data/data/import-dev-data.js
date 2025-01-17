const dotenv=require('dotenv')
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});
const fs= require('fs');
const Tour= require('../../models/tourModel');
const User=require('../../models/userModel');
const Review=require('../../models/reviewModel')
const DB= process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
  .then(() => console.log('DB connection success!'))
  .catch((err) => {
    console.error('DB connection error:', err.message);
  });


 //read json file 
 const tours= JSON.parse( fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
 const users= JSON.parse( fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
 const reviews= JSON.parse( fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

 //import data  into db
 
 const importData= async()=>{
    try{
        await Tour.create(tours);
        await User.create(users, {validatorBeforeSave:false});
        await Review.create(reviews);
        console.log('data successfully inserted')
        
    }
    catch(e){
        console.log(e);
    }
    process.exit();
 }

 //delete all data
 const deleteData=  async()=>{

    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('data successfully deleted')
       
    }
    catch(e){
        console.log(e);
    }
    process.exit()
 }

if(process.argv[2]=== '--import'){
    importData();
}
else if(process.argv[2]==='--delete'){
    deleteData();
}

//  console.log(process.argv)