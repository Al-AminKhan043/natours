const dotenv=require('dotenv')
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});

const app=require('./app');
const DB= process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
  .then(() => console.log('DB connection success!'))
  .catch((err) => {
    console.error('DB connection error:', err.message);
  });
const port = process.env.PORT ||  8000;
const server= app.listen(port, ()=>{
    console.log(`running on ${port}...`);
});

process.on('unhandledRejection',err=>{
  console.log('Unhandled Rejection! Shutting Down...')
  console.log(err.name);
  server.close(()=>{
  process.exit(1);
  })
  
})
process.on('uncaughtException',err=>{
  console.log('Uncaught Exception! Shutting Down...')
  console.log(err.name);
  server.close(()=>{
  process.exit(1);
  })
})

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});