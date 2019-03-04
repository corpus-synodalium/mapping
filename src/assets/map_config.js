const config = {};

config.params = {
  center: [53.5, 5],
  zoomControl: false,
  zoom: 5,
  maxZoom: 9,
  minZoom: 4,
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
  color3: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'],
  color4: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
  bw: ['#ccc', '#999', '#666', '#323232', '#000'],
}

export default config;
