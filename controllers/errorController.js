const AppError=require('../utils/appError');
const handleCastErrorDB=err=>{
    const message=`Invalid ${err.path}: ${err.value}.`
    return new AppError(message,400);
}
const handleDuplicateFieldsDB= err=>{
    // const value=err.keyValue.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    // console.log(value); 
    // const message=`Duplicate field Value: x Please use another value!`  
    const key= Object.keys(err.keyValue)[0];
    const value=err.keyValue[key];
    // console.log('Duplicate field:', key, 'Value:', value);
    const message = `Duplicate field value: '${value}' for field '${key}'. Please use another name!`;
    return new AppError(message,400);

}
const handleValidationErrorDB=err=>{
    const errors= Object.values(err.errors).map(el=> el.message);
    const message=`Invalid Input Data ${errors.join('. ')}`;
    return new AppError(message,400);
}

const handleJwtError=(e)=>{
    return new AppError('Invalid Token. Please login again',401);
}
const handleJwtExpiredError=(e)=>{
    return new AppError('Your token has expired!',401);
}
const sendErrorDev= (err,req,res)=>{
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
            status: err.status,
            error:err,
            message: err.message,
            stack:err.stack
        })
    }
    else{
        res.status(err.statusCode).render('error',{
            title:'Something went wrong!',
            msg:err.message
        })
    }
  
}

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
      // A) Operational, trusted error: send message to client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      }
      // B) Programming or other unknown error: don't leak error details
      // 1) Log error
      console.error('ERROR 💥', err);
      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  
    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      console.log(err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.'
    });
  };

module.exports= (err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status= err.status || 'error';
    if(process.env.NODE_ENV==='development'){
       sendErrorDev(err,req,res);
    }
    else if(process.env.NODE_ENV==='production'){
        let error={...err};
        error.message = err.message; // Ensure the message is copied
        error.name = err.name;
        error.code=err.code;
        if(error.name==='CastError') error=handleCastErrorDB(error)
        if(error.code===11000) error=handleDuplicateFieldsDB(error)
        if(error.name==='ValidationError') error=handleValidationErrorDB(error);
        if(error.name==='JsonWebTokenError') error=handleJwtError(error);
        if(error.name==='TokenExpiredError') error=handleJwtExpiredError(error);        
        sendErrorProd(error,req,res);
    }
    
}


