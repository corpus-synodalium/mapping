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
    this.onEachFeature = this.onEachFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.style = this.style.bind(this);
  }

  getColor(shpfid) {
    const colors = ['#f6eff7', '#bdc9e1', '#67a9cf', '#1c9099', '#016c59'];
    const id = parseInt(shpfid.substring(1, 5), 10);
    return colors[id % colors.length];
  }

  style(feature) {
    return {
      fillColor: this.getColor(feature.properties.SHPFID),
      weight: 2,
      opacity: 3,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5,
    };
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
    });
  }

  highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 3,
      color: '#5C4D63',
      dashArray: '',
      fillOpacity: 0.7,
    });

    layer.bringToFront();
  }

  resetHighlight(e) {
    this.refs.geojson.leafletElement.resetStyle(e.target);
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
        <GeoJSON
          data={geojson}
          style={this.style}
          onEachFeature={this.onEachFeature}
          ref="geojson"
        />
      </Map>
    );
  }
}
