'use strict';
const fetch = require('node-fetch');

module.exports = {
    getQuakeData: (data) => {
        let day = new Date();
        day.setDate(day.getDate() - 1);
        const url = [
            'http://earthquake.usgs.gov/fdsnws/event/1/query?',
            'format=geojson',
            'lat=37.757815',
            'lon=-122.5076403',
            'maxradiuskm=100',
            `starttime=${day.toISOString()}`].join('&');

        console.log("Getting quake data")
        console.log('url', url);
        return new Promise((resolve) =>{
            fetch(url).then((response) => {
            resolve(response.json());
            })
        })
    }
}