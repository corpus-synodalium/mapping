import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import mapConfig from '../assets/map_config';
import './Map.css';

export default class SimpleExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: mapConfig,
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
      </Map>
    );
  }
}
