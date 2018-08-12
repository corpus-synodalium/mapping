import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import mapConfig from '../assets/map_config';
import geojson from '../assets/great_britain.json';
import './Map.css';

//=================
// Mapbox base map
//=================

class BaseMap extends React.Component {
  render() {
    const { tileLayer } = this.props.config;
    return (
      <TileLayer
        attribution={tileLayer.params.attribution}
        url={tileLayer.uri}
        id={tileLayer.params.id}
        accessToken={tileLayer.params.accessToken}
        maxZoom={tileLayer.params.maxZoom}
      />
    );
  }
}

//================
// Geo JSON layer
//================

class GeoJSONLayer extends React.Component {
  constructor(props) {
    super(props);
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
    return (
      <GeoJSON
        data={geojson}
        style={this.style}
        onEachFeature={this.onEachFeature}
        ref="geojson"
      />
    );
  }
}

//====================
// Main map component
//====================

class LocalLegislationMap extends Component {
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
        <BaseMap config={config} />
        <GeoJSONLayer />
      </Map>
    );
  }
}

export default LocalLegislationMap;
