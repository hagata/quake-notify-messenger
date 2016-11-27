'use strict';
const fetch = require('node-fetch');

module.exports = {
    getQuakeData: (data) => {
        const url = [
            'http://earthquake.usgs.gov/fdsnws/event/1/query?',
            'format=geojson',
            'lat=37.757815',
            'lon=-122.5076403',
            'maxradiuskm=100'].join('&');
        // const params ={
        //     format: 'geojson',
        //     lat: 37.757815,
        //     lon: -122.5076403,
        //     maxradiuskm: 100
        //     };
        // const req = new Request(url, params);

        console.log("Getting quake data")
        console.log('url', url);
        return new Promise((resolve) =>{
            fetch(url).then((response) => {
            resolve(response);
            })
        })
    }
}