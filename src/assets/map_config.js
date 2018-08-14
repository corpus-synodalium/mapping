const config = {};

config.params = {
  center: [54.5, -3],
  zoomControl: false,
  zoom: 6,
  maxZoom: 9,
  minZoom: 5,
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

config.colorSchemes = {
  color1: ['#f6eff7', '#bdc9e1', '#67a9cf', '#1c9099', '#016c59'],
  color2: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'],
  color3: ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'],
  color4: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
  bw: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'],
}

export default config;
