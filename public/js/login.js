import axios from 'axios'
import {showAlert} from './alerts';
export const login= async(email,password)=>{
    
    try{
    const res= await axios({
        method: 'POST',
        url:'/api/v1/users/login',
        data:{
            email,
            password
        }
    })

    if(res.data.status==='success'){
        showAlert('success','Loggen In Successfully');
        window.setTimeout(()=>{
            location.assign('/')
        },1500)
    }
    
}
catch(e){
    showAlert('error',e.response.data.message);
}
}

export const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/users/logout'
      });
      if ((res.data.status === 'success')) location.reload(true);
    } catch (err) {
      console.log(err.response);
      showAlert('error', 'Error logging out! Try again.',err);
    }
  };

