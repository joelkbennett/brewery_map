var gmap = require('google-maps');
var $ = require('jquery');
var secret = require('../../config/secret');

var search = $('#brewery-search');
var brewMap;
var history = [];
var historyList = $('.search-history');
var infoWindow;

gmap.KEY = secret.gmaps_key;
gmap.LIBRARIES = ['geometry', 'places'];

gmap.load(function(google) {
  brewMap = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 49.2, lng: -123.2},
    mapTypeControl: false,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    }
  });

  infoWindow = new google.maps.InfoWindow();
});


// Search

search.on('submit', function(e) {
  e.preventDefault();
  var city = search.find('#brewery-city').val();
  var countryCode = search.find('#brewery-country').val();

  $.get('/search?city=' + city + '&countryCode=' + countryCode).done(function(res) {
    res.data.forEach(function(brew) {
      setMarker(brew);
    });

    var center = new google.maps.LatLng(res.data[0].latitude, res.data[0].longitude);
    brewMap.panTo(center);
    addToHistory(city, countryCode, res.data);
  });

});

function setMarker(place) {
  getBrewerInfo(place.id, function(name) {
    var name = name;
    var marker = new google.maps.Marker({
      position: { lat: place.latitude, lng: place.longitude },
      map: brewMap,
      id: place.id,
      name: name
    });

    // populateInfoWindow(name);

    marker.addListener('click', function() {
      infoWindow.content = name;
      getBrewerInfo(this.id);
      infoWindow.open(brewMap, this);
    });

  });
}

function getBrewerInfo(id, callback) {
  $.get('/brewery?id=' + id).done(function(res) {
    callback(res.data.name);
  });
}

function populateInfoWindow(content) {
  infoWindow.content = content;
}

// History

function addToHistory(city, country, data) {
  history.push({
    city: city,
    country: country,
    data: data
  });

  var newSearch = $('<button>').text(city + ', ' + country).addClass('history-button');
  historyList.append(newSearch);
}

function addPinsFromHistory() {
  // get the data from a button
  // match to the index in history
  // drop the pins
  // panTo one of them
}




