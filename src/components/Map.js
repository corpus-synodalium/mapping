import React, { Component } from 'react';
import {
  Map as LeafletMap,
  TileLayer,
  GeoJSON,
  ScaleControl,
} from 'react-leaflet';
import { Card, Dropdown, Icon } from 'semantic-ui-react';
import mapConfig from '../assets/map_config';
import geojson from '../assets/d25.json';
import metadata from '../assets/metadata.json';
import s2d from '../assets/s2d.json';
import dioceseInfo from '../assets/diocese_info.json';
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
    this.shapeToDiocese = s2d.map;
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
    const info = { text: 'No data available' };
    if (this.shapeToDiocese.hasOwnProperty(shpfid)) {
      const dioceseId = this.shapeToDiocese[shpfid];
      info.text = dioceseId;
      if (dioceseInfo.hasOwnProperty(dioceseId)) {
        const {
          diocese_name,
          diocese_alt,
          province,
          country_modern,
        } = dioceseInfo[dioceseId];
        const diocese = diocese_alt
          ? `${diocese_name} (${diocese_alt})`
          : diocese_name;
        info.diocese = diocese;
        info.province = province;
        info.country = country_modern;
      }
    }

    this.props.updateInfo(info);

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
  render() {
    const colorSchemeOptions = [
      {
        text: 'Black & White',
        value: 'bw',
      },
      {
        text: 'Colors #1',
        value: 'color1',
      },
      {
        text: 'Colors #2',
        value: 'color2',
      },
      {
        text: 'Colors #3',
        value: 'color3',
      },
      {
        text: 'Colors #4',
        value: 'color4',
      },
    ];
    return (
      <Card className="panel">
        <Card.Content>
          <h4>
            <Icon name="setting" /> Control Panel
          </h4>
          <Dropdown
            placeholder="color scheme"
            options={colorSchemeOptions}
            onChange={(e, data) => this.props.changeColorScheme(data.value)}
            selection
            fluid
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
    const text = info ? info.diocese : 'Hover over a region';
    const attributes = ['province', 'country'];
    const title = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    if (info) {
      var listItems = attributes.reduce((items, attr) => {
        if (info.hasOwnProperty(attr)) {
          items.push(
            <li key={attr}>
              {title(attr)}: {info[attr]}
            </li>,
          );
        }
        return items;
      }, []);
    }

    return (
      <Card className="panel panel-info">
        <Card.Content>
          <h4>{text}</h4>
          {info && <ul className="panel-list">{listItems}</ul>}
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

  changeColorScheme(colorScheme) {
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
