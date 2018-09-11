import React, { Component } from 'react';
import {
  Map as LeafletMap,
  TileLayer,
  GeoJSON,
  ScaleControl,
} from 'react-leaflet';
import { Checkbox, Card, Icon } from 'semantic-ui-react';
import mapConfig from '../assets/map_config';
import geojson from '../assets/d25.json';
import metadata from '../assets/metadata.json';
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
    this.metadataMap = this.createMetadataMap();
    this.onEachFeature = this.onEachFeature.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.zoomToFeature = this.zoomToFeature.bind(this);
    this.style = this.style.bind(this);
  }

  createMetadataMap() {
    return metadata.reduce((hash, current) => {
      hash.set(current.shapeFileID, current);
      return hash;
    }, new Map());
  }

  getColor(shpfid, props) {
    const { colorSchemes } = this.props.config;
    const { currentColorScheme } = this.props;
    const colors = colorSchemes[currentColorScheme];
    const id = parseInt(shpfid.substring(1, 5), 10);
    return colors[id % colors.length];
  }

  style(feature) {
    return {
      fillColor: this.getColor(feature.properties.SHPFID),
      weight: 1,
      opacity: 3,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
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
    const { SHPFID: shpfid } = layer.feature.properties;
    const data = this.metadataMap.get(shpfid);
    const name = data ? data.name : 'No data available';
    this.props.updateInfo({ name });

    layer.setStyle({
      weight: 2,
      color: 'black',
      dashArray: '',
      fillOpacity: 1.0,
    });

    layer.bringToFront();
  }

  resetHighlight(e) {
    const { leafletElement } = this.geojsonRef.current;
    leafletElement.resetStyle(e.target);
    this.props.updateInfo(null);
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

//===============
// Control Panel
//===============

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const callback = () => {
      this.props.changeColorScheme(this.state.checked);
    };
    this.setState(
      (prevState) => ({
        checked: !prevState.checked,
      }),
      callback,
    );
  }

  render() {
    return (
      <Card className="panel">
        <Card.Content>
          <h4>
            <Icon name="setting" /> Control Panel
          </h4>
          <Checkbox
            label="color-blind mode"
            onChange={this.handleChange}
            checked={this.state.checked}
          />
        </Card.Content>
      </Card>
    );
  }
}

//============
// Info Panel
//============

class InfoPanel extends React.Component {
  render() {
    const { info } = this.props;
    const text = info ? info.name : 'Hover over a region';
    return (
      <Card className="panel panel-info">
        <Card.Content>
          <h4>{text}</h4>
        </Card.Content>
      </Card>
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
      currentColorScheme: 'color1',
      info: null,
    };
    this.mapRef = React.createRef();
    this.changeColorScheme = this.changeColorScheme.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  changeColorScheme(bw) {
    const colorScheme = bw ? 'bw' : 'color1';
    this.setState({
      currentColorScheme: colorScheme,
    });
  }

  updateInfo(info) {
    this.setState({
      info: info,
    });
  }

  render() {
    const config = this.state.config;
    return (
      <div>
        <InfoPanel info={this.state.info} />
        <ControlPanel changeColorScheme={this.changeColorScheme} />
        <LeafletMap
          id="mapid"
          ref={this.mapRef}
          center={config.params.center}
          zoom={config.params.zoom}
          minZoom={config.params.minZoom}
          maxZoom={config.params.maxZoom}
        >
          <ScaleControl />
          <BaseMap config={config} />
          <GeoJSONLayer
            config={config}
            mapRef={this.mapRef}
            updateInfo={this.updateInfo}
            currentColorScheme={this.state.currentColorScheme}
          />
        </LeafletMap>
      </div>
    );
  }
}

export default LocalLegislationMap;
