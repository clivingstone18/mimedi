import Geocode from "react-geocode";
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);


const getGeoCodeFromAdd = async (add) => {
    return new Promise((resolve, reject) => {
        const center = {};
        Geocode.fromAddress(add).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              center.lat = lat;
              center.lng = lng;
              resolve(center);
            },
            (error) => {
              console.error(error);
            }
        )
    })
}

export const GetAddress = async (addresses) => {
    return new Promise((resolve,reject) => {
        let promises = [];
        for (let i = 0; i < addresses.length; i++) {
            promises.push(getGeoCodeFromAdd(addresses[i].address));
        }
        Promise.all(promises).then(res=>resolve(res)).catch(e=>reject(e));
    })
}
    
