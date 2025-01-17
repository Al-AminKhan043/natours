


// export const displayMap= (locations)=>{

//     mapboxgl.accessToken = 'pk.eyJ1IjoiYWxhbWluMDQzIiwiYSI6ImNtNXUyMDYwZTB2cm8ycXM1OW5mNnAya2YifQ.ddZnePxS78iurByc_8wyTA';
//     const map = new mapboxgl.Map({
//         container: 'map', // container ID
//         style: 'mapbox://styles/alamin043/cm5u2x40s00ao01sb1ke8anje', 
//         scrollZoom:false
//       });
    
//     const bounds= new mapboxgl.LngLatBounds();
//     locations.forEach(loc => {
//         const el=document.createElement('div');
//         el.className='marker';
//         new mapboxgl.Marker({
//             element:el,
//             anchor:'bottom'
//         }).setLngLat(loc.coordinates).addTo(map);
    
//         new mapboxgl.Popup({
//             offset:30
//         }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`).addTo(map)
//         bounds.extend(loc.coordinates)
        
//     });  
//     map.fitBounds(bounds,{
//         padding:{
//             top:200,
//             bottom:150,
//             left:100,
//             right:100
//         }
//     });

// }


export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxhbWluMDQzIiwiYSI6ImNtNXUyMDYwZTB2cm8ycXM1OW5mNnAya2YifQ.ddZnePxS78iurByc_8wyTA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/alamin043/cm5u2x40s00ao01sb1ke8anje',
        scrollZoom: false,
        zoom: 12, // You can adjust this value based on your needs
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
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

    // Ensure the map bounds are fit based on locations
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });

    map.resize(); // Trigger resize after rendering the map
};

