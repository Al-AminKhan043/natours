require("@babel/polyfill");
var $knI9B$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

const $f60945d37f8e594c$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxhbWluMDQzIiwiYSI6ImNtNXUyMDYwZTB2cm8ycXM1OW5mNnAya2YifQ.ddZnePxS78iurByc_8wyTA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/alamin043/cm5u2x40s00ao01sb1ke8anje',
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        const el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`).addTo(map);
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};



const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === 'success') {
            alert('Loggen In Successfully');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
};


const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById('map');
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector('form.form--login');
if ($d0f7ce18c37ad6f6$var$mapBox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(locations);
}
if ($d0f7ce18c37ad6f6$var$loginForm) $d0f7ce18c37ad6f6$var$loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=index.js.map
