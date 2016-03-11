var gmap = require('google-maps');
var $ = require('jquery');
var secret = require('../../config/secret');

var search = $('#brewery-search');
var brewMap;
var history = [];
var historyList = $('.search-history');

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
});

// Search

search.on('submit', function(e) {
  e.preventDefault();
  var city = search.find('#brewery-city').val();
  var countryCode = search.find('#brewery-country').val();

  $.get('/search?city=' + city + '&countryCode=' + countryCode).done(function(res) {
    res.data.forEach(function(brew) {
      console.log(brew);

      var marker = new google.maps.Marker({
        position: { lat: brew.latitude, lng: brew.longitude },
        map: brewMap,
        title: brew.name
      });

      var infowindow = new google.maps.InfoWindow({
        content: brew.name
      });

      marker.addListener('click', function() {
        infowindow.open(brewMap, this);
      });
    });

    var center = new google.maps.LatLng(res.data[0].latitude, res.data[0].longitude);
    brewMap.panTo(center);

    addToHistory(city, countryCode, res.data);
  });

});

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




