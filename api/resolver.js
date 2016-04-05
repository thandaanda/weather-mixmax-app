var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function (req, res) {
    var term = req.query.text.trim();

    if (/^http:\/\/openweather\.com\/\S+/.test(term)) {
        // Special-case: handle strings in the special URL form that are suggested by the /typeahead
        // API. This is how the command hint menu suggests an exact Giphy image.
        handleCityString(term.replace(/^http:\/\/openweather\.com\//, ''), req, res);
    } else {
        // Else, if the user was typing fast and press enter before the /typeahead API can respond,
        // Mixmax will just send the text to the /resolver API (for performance). Handle that here.
        handleSearchString(term, req, res);
    }
};

function handleCityString(cityName, req, res) {
    var response;
    try {
        response = sync.await(request({
            url: 'http://api.openweathermap.org/data/2.5/weather',
            qs: {
                q: cityName,
                mode: 'html',
                appid: key.OPEN_WEATHER_MAP_KEY
            },
            gzip: true,
            json: true,
            timeout: 15 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }

    var html = response.body.substring(response.body.indexOf('<div'), response.body.lastIndexOf('</div>'));
    res.json({
        body: html
    });
}

function handleSearchString(term, req, res) {
    var response;
    try {
        response = sync.await(request({
            url: 'http://api.openweathermap.org/data/2.5/weather',
            qs: {
                q: term,
                mode: 'html',
                appid: key.OPEN_WEATHER_MAP_KEY
            },
            gzip: true,
            json: true,
            timeout: 15 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }

    var html = response.body.substring(response.body.indexOf('<div'), response.body.lastIndexOf('</div>'));
    res.json({
        body: html
    });
}