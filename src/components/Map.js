import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import mapConfig from '../assets/map_config';
import geojson from '../assets/great_britain.json';
import './Map.css';

export default class SimpleExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: mapConfig,
    };
  }

  style(feature) {
    const colors = ['#f6eff7', '#bdc9e1', '#67a9cf', '#1c9099', '#016c59'];

    const getColor = (shpfid) => {
      const id = parseInt(shpfid.substring(1, 5), 10);
      return colors[id % colors.length];
    };

    return {
      fillColor: getColor(feature.properties.SHPFID),
      weight: 2,
      opacity: 3,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5,
    };
  }

  render() {
    const config = this.state.config;
    return (
      <Map id="mapid" center={config.params.center} zoom={config.params.zoom}>
        <TileLayer
          attribution={config.tileLayer.params.attribution}
          url={config.tileLayer.uri}
          id={config.tileLayer.params.id}
          accessToken={config.tileLayer.params.accessToken}
          maxZoom={config.tileLayer.params.maxZoom}
        />
        <GeoJSON data={geojson} style={this.style} />
      </Map>
    );
  }
}
