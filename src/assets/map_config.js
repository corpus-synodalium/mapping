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
  uri: 'https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
  params: {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    id: 'thawsitt9/cjksjbvws6gg82so6qfrkz64l',
    accessToken: 'pk.eyJ1IjoidGhhd3NpdHQ5IiwiYSI6ImNqanVyb291OTlrNXczdm82dzZpdnpzOXkifQ.5M-0ikm69X-qx8I1zN0IRA',
  },
};

export default config;
