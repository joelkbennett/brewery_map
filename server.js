var express = require('express');
var http = require('http');
var app = express();
var async = require('async');
var request = require('request');
var secret = require('./config/secret');
var breweries;

app.use(express.static('app'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

function cb(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('two');
    breweries = JSON.parse(body);
  }
}

app.get('/search', function(req, res) {
  async.series([
    function(callback) {
      console.log(req.query);
      var options = { 
        url: 'http://api.brewerydb.com/v2/locations?locality=' + req.query.city + 
        '&countryIsoCode=' + req.query.countryCode + 
        '&key=' + secret.brewerydb_key + 
        '&format=json'
      };
      request(options, cb);
      callback(null, 'one');
    }, function(callback) {
      callback(null, 'two');
    }
  ], function(err, result) {
    res.send(breweries);
  });
});

app.listen(3000, function() {
    console.log('Running on localhost:3000');
});