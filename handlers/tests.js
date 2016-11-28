'use strict';
const fetch = require('node-fetch');
const handlers = require('./quakes');

module.exports = {
    getTestData: (data) => {
        handlers.getQuakeData().then((data) => {
        console.log('Data from quake', data);
        let count = data.metadata.count;
        let latest = data.features[0];
        let title = latest.properties.title;

        // construct a quake message from data
        let countMessageText = `in the last 24 hours there have been ${count} earthquakes`;
        let latestMessageText = `The latest earthquake was: ${title}`;

        //send message to user
        console.log('\n\n====RESULTS:\n')
        console.log('count', count)
        console.log('latest', latest)
        console.log('title', title)
        console.log('\n====:\n')
        })
    }
}