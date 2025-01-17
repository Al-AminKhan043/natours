
import {displayMap} from './mapbox'
import {login,logout} from './login'
import {updateSettings} from './updateSettings'
import {bookTour} from './stripe'

const mapBox=document.getElementById('map')
const loginForm=document.querySelector('form.form--login')
const logoutButton=document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form.form-user-password');
const bookBtn=document.getElementById('book-tour')

if(mapBox){
const locations=JSON.parse(document.getElementById('map').dataset.locations);
displayMap(locations);
}

if(loginForm){
loginForm.addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password= document.getElementById('password').value;
    login(email,password);
})
}
if(logoutButton) logoutButton.addEventListener('click',logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';
  
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password'
      );
  
      document.querySelector('.btn--save-password').textContent = 'Save password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    });




    if (bookBtn) {
      bookBtn.addEventListener('click', async e => {
        e.target.textContent = 'Processing...'; // Change text to 'Processing...'
        const { tourId } = e.target.dataset; // Get tourId from button's data attribute
    
        try {
          console.log(tourId); 
          await bookTour(tourId); // Call the bookTour function and wait for it to complete
          // Optionally, change the button text to something else if needed
        } catch (err) {
          e.target.textContent = 'Book tour now!'; // Reset the button text on error
          showAlert('error', 'Something went wrong!'); // Optionally, show an error alert
        }
      });
    }