// /* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';
// const stripe = Stripe('pk_test_51QhphIBioTk966vCol5J7t2lVLnSMtX0TRObkhdmdVfpNbBZ4yIL8fIxb4JufRwL5tGNau5zAnHvzv66ovB2hOrT00mQDUrxQb');

// export const bookTour = async tourId => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(
//       `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
//     );
//     console.log(session);

//     // 2) Create checkout form + chanre credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err);
//   }
// };


/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';
// import { loadStripe } from '@stripe/stripe-js'; // Importing loadStripe from @stripe/stripe-js

// // Initialize Stripe with your public key
// const stripePromise = loadStripe('pk_test_51QhphIBioTk966vCol5J7t2lVLnSMtX0TRObkhdmdVfpNbBZ4yIL8fIxb4JufRwL5tGNau5zAnHvzv66ovB2hOrT00mQDUrxQb');

// export const bookTour = async tourId => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(
//       `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
//     );
//     console.log(session);

//     // 2) Create checkout form + charge credit card
//     const stripe = await stripePromise; // Ensure Stripe is loaded asynchronously
//     const { error } = await stripe.redirectToCheckout({
//       sessionId: session.data.session.id
//     });

//     // Handle any errors during checkout
//     if (error) {
//       showAlert('error', error.message);
//     }
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err.message || 'Something went wrong!');
//   }
// };


//////////////// this works

// import axios from 'axios';
// import { showAlert } from './alerts';
// import { loadStripe } from '@stripe/stripe-js'; // Importing loadStripe from @stripe/stripe-js

// // Initialize Stripe with your public key
// const stripePromise = loadStripe('pk_test_51QhphIBioTk966vCol5J7t2lVLnSMtX0TRObkhdmdVfpNbBZ4yIL8fIxb4JufRwL5tGNau5zAnHvzv66ovB2hOrT00mQDUrxQb');

// export const bookTour = async tourId => {
//   try {
//     // 1) Get checkout session from API
//     const { data } = await axios(
//       `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
//     );

//     console.log('Session Data:', data); // Log the session data returned from the API

//     if (data.status === 'success' && data.session) {
//       // 2) Create checkout form + charge credit card
//       const stripe = await stripePromise;
//       console.log('Stripe Loaded:', stripe); // Log the stripe object to ensure it's loaded correctly

//       const { error } = await stripe.redirectToCheckout({
//         sessionId: data.session.id,
//       });
//       console.log('Redirect to Checkout Error:', error)
//       if (error) {
//         showAlert('error', error.message);
//         console.log('Stripe Checkout Error:', error); // Log the error returned from Stripe
//       }
//     } else {
//       showAlert('error', 'Session creation failed!');
//       console.log('Session Creation Failed:', data); // Log failure details if session creation fails
//     }
//   } catch (err) {
//     console.log('Error during booking:', err); // Log the error during the API call or any other issues
//     showAlert('error', err.message || 'Something went wrong!');
//   }
// };

/////


import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const { data } = await axios.get(
      `/api/v1/booking/checkout-session/${tourId}`
    );

    // console.log('Session Data:', data); // Log the session data returned from the API

    if (data.status === 'success' && data.session) {
      // 2) Redirect to the checkout URL manually
      const checkoutUrl = data.session.url; // Ensure your API includes a 'url' field in the session object
      if (checkoutUrl) {
        // console.log('Redirecting to:', checkoutUrl); // Log the URL for debugging
        window.location.href = checkoutUrl;
      } else {
        showAlert('error', 'Checkout URL not found!');
        console.log('Checkout URL not found in session data:', data.session);
      }
    } else {
      showAlert('error', 'Session creation failed!');
      console.log('Session Creation Failed:', data); // Log failure details if session creation fails
    }
  } catch (err) {
    console.log('Error during booking:', err); // Log the error during the API call or any other issues
    showAlert('error', err.message || 'Something went wrong!');
  }
};

