var express = require('express');
var http = require('http');
var app = express();
var async = require('async');
var request = require('request');
var secret = require('./config/secret');
var breweries;

app.use(express.static('assets'));
app.use(express.static('dist'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/search', function(req, res) {
  async.series([
    function(callback) {
      var options = { 
        url: 'http://api.brewerydb.com/v2/locations?locality=' + req.query.city + 
        '&countryIsoCode=' + req.query.countryCode + 
        '&key=' + secret.brewerydb_key + 
        '&format=json'
      };

      request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(null, JSON.parse(body));
        }       
      });
    }], function(err, result) {
      res.send(result[0]);
  });
});

app.get('/brewery', function(req, res) {
  async.series([
    function(callback) {
      var options = {
        url: 'http://api.brewerydb.com/v2/brewery/' + req.query.id + '?key=' + secret.brewerydb_key + '&format=json'
      };

      request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(null, JSON.parse(body));
        } else {
          callback(error, null);
        }
      });
    }], function(err, result) {
      res.send(result[0]);
  });
});

app.listen(3000, function() {
    console.log('Running on localhost:3000');
});