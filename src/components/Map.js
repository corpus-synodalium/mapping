import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON, ScaleControl } from 'react-leaflet';
import { Checkbox } from 'semantic-ui-react';
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
    this.state = {
      prevShape: null,
    };
    this.geojsonRef = React.createRef();
    this.onEachFeature = this.onEachFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.zoomToFeature = this.zoomToFeature.bind(this);
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
      click: this.zoomToFeature,
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
    const { leafletElement } = this.geojsonRef.current;
    leafletElement.resetStyle(e.target);
  }

  zoomToFeature(e) {
    const { leafletElement } = this.props.mapRef.current;
    const targetShape = e.target.feature.properties.SHPFID;

    if (targetShape === this.state.prevShape) {
      // reset map zoom
      const { center, zoom } = this.props.config.params;
      leafletElement.setView(center, zoom);
      this.setState({
        prevShape: null,
      });
    } else {
      // zoom to the clicked shape
      leafletElement.fitBounds(e.target.getBounds());
      this.setState({
        prevShape: targetShape,
      });
    }
  }

  render() {
    return (
      <GeoJSON
        data={geojson}
        style={this.style}
        onEachFeature={this.onEachFeature}
        ref={this.geojsonRef}
      />
    );
  }
}

//============
// Info Panel
//============

class InfoPanel extends React.Component {
  render() {
    return (
      <div className="info">
        <h4>Info Pane</h4>
        <Checkbox label="color-blind mode" />
      </div>
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
    this.mapRef = React.createRef();
  }

  render() {
    const config = this.state.config;
    return (
      <div>
        <InfoPanel />
        <Map
          id="mapid"
          ref={this.mapRef}
          center={config.params.center}
          zoom={config.params.zoom}
        >
          <ScaleControl />
          <BaseMap config={config} />
          <GeoJSONLayer config={config} mapRef={this.mapRef} />
        </Map>
      </div>
    );
  }
}

export default LocalLegislationMap;
