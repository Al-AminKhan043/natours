const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors=require('cors');
const compression=require('compression')
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const bookingController=require('./controllers/bookingController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');

app.enable('trust proxy');

// Helmet security headers middleware (apply early)
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'", 
      "https://cdnjs.cloudflare.com", 
      "https://api.mapbox.com",
      "https://js.stripe.com"  // Stripe script domain
    ],
    scriptSrcElem: [
      "'self'", 
      "https://cdnjs.cloudflare.com", 
      "https://api.mapbox.com", 
      "https://js.stripe.com"  // Stripe script domain for elements as well
    ],
    frameSrc: [
      "https://js.stripe.com",
      "https://checkout.stripe.com"
    ],
    connectSrc: [
      "'self'", 
      "https://api.stripe.com"
    ],
  }
}));


app.use(compression());

app.use(cors());

app.options('*',cors());

// Rate limiter (before routing)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again after an hour!',
});
app.use('/api', limiter);


app.post('/webhook-checkout',express.raw({type:'application/json'}),bookingController.webhookheckout)

// Body parsers for JSON and URL-encoded data
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss()); // Protection against XSS attacks
app.use(hpp({ // Protection against HTTP param pollution
  whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));

// Request time logging middleware (after sanitization)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Static files should come after all middleware processing
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine and views directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Route Handlers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

// Global error handler (this should be last)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
