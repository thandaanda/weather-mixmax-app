var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function (req, res) {
    var city = req.query.text.trim();
    if (!city) {
        res.json([{
            title: '<i>(enter a city)</i>',
            text: ''
    }]);
        return;
    }

    var response;
    try {
        response = sync.await(request({
            url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
            qs: {
                input: city,
                types: '(cities)',
                key: key.GOOGLE_AUTOCOMPLETE_KEY
            },
            gzip: true,
            json: true,
            timeout: 10 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }

    if (response.statusCode !== 200 || !response.body || !response.body.status == "OK") {
        res.status(500).send('Error');
        return;
    }

    var results = _.chain(response.body.predictions)
        .reject(function (prediction) {
            return !prediction || !prediction.place_id;
        })
        .map(function (prediction) {
            return {
                title: prediction.description,
                text: 'http://openweather.com/' + prediction.description.substring(0, prediction.description.indexOf(','))
            };
        })
        .value();

    if (results.length === 0) {
        res.json([{
            title: '<i>(no results)</i>',
            text: ''
    }]);
    } else {
        res.json(results);
    }
};