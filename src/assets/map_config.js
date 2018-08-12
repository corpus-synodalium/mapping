const config = {};

config.params = {
  center: [54.5, -3],
  zoomControl: false,
  zoom: 6,
  maxZoom: 19,
  minZoom: 11,
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true,
};

config.tileLayer = {
  uri: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  params: {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoidGhhd3NpdHQ5IiwiYSI6ImNqanVyb291OTlrNXczdm82dzZpdnpzOXkifQ.5M-0ikm69X-qx8I1zN0IRA',
  },
};

export default config;
