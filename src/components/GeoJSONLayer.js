import React, { Component } from 'react';
import { GeoJSONFillable, Patterns } from 'react-leaflet-geojson-patterns';
import idMap from '../assets/id_map.json';
import dioceseInfo from '../assets/diocese_info.json';
import databaseJurIDs from '../assets/jurisdiction_ids_in_database.json';

class GeoJSONLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diocese_geojson: null,
      province_geojson: null,
      isLoading: true,
    };
    this.geojsonRef = React.createRef();
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_DIOCESE_URL)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          diocese_geojson: data,
          isLoading: false,
        });
      });

    fetch(process.env.REACT_APP_PROVINCE_URL)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          province_geojson: data,
        });
      });
  }

  style = (feature) => {
    if (_inDatabase(feature)) {
      return {
        fillColor: _getColor(feature.properties.SHPFID, this.props),
        fillOpacity: 1.0,
        weight: 1,
        opacity: 3,
        color: 'grey',
        dashArray: '',
      };
    }

    return {
      fillColor: '#fff',
      fillOpacity: this.props.showStripedRegions ? 0.8 : 0,
      weight: 0,
      fillPattern: Patterns.StripePattern({
        color: '#fff',
        key: 'stripe',
      }),
    };
  };

  onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.showRecordsModal,
    });
  };

  highlightFeature = (e) => {
    const layer = e.target;
    if (_inDatabase(layer.feature) || this.props.showStripedRegions) {
      const info = _getDioceseData(layer, this.props.mappingData);
      this.props.updateInfo(info);
    }

    let style;
    if (_inDatabase(layer.feature)) {
      style = {
        weight: 2,
        color: 'black',
        dashArray: '',
        fillOpacity: 1.0,
      };
    } else {
      style = {
        weight: this.props.showStripedRegions ? 0.5 : 0,
        color: 'black',
        dashArray: '3',
        fillOpacity: this.props.showStripedRegions ? 1.0 : 0,
      };
    }

    layer.setStyle(style);
    layer.bringToFront();
  };

  resetHighlight = (e) => {
    const { leafletElement } = this.geojsonRef.current;
    leafletElement.resetStyle(e.target);
    this.props.updateInfo(null);
  };

  showRecordsModal = (e) => {
    var layer = e.target;
    const info = _getDioceseData(layer, this.props.mappingData);
    if (info.hasMappingData) {
      this.props.showRecordsModal(info);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <span />;
    }
    return (
      <div>
        <GeoJSONFillable
          data={this.state.diocese_geojson}
          style={this.style}
          onEachFeature={this.onEachFeature}
          ref={this.geojsonRef}
        />
      </div>
    );
  }
}

/******************************************************
HELPER FUNCTIONS
******************************************************/

// Returns a color based on hits
const _getColor = (shpfid, props) => {
  const { colorSchemes } = props.config;
  const { mappingData, currentColorScheme, maxNumEntries } = props;
  const colors = colorSchemes[currentColorScheme];

  if (mappingData) {
    const jurID = idMap[shpfid];
    const numPerBucket = Math.ceil(maxNumEntries / colors.length);
    if (mappingData.hasOwnProperty(jurID)) {
      const numEntries = mappingData[jurID].length;
      let index = Math.floor((numEntries - 1) / numPerBucket);
      if (index > colors.length - 1) {
        index = colors.length - 1;
      }
      return colors[index];
    }
  }
  return '#fff';
};

// Returns true if a jurisdiction id appears in database
const _inDatabase = (feature) => {
  const shapeID = feature.properties.SHPFID;
  const jurID = idMap[shapeID];
  return databaseJurIDs.indexOf(jurID) >= 0;
};

// TODO: update for provinces
const _getDioceseData = (layer, mappingData) => {
  const { SHPFID: shpfid } = layer.feature.properties;
  const info = {};
  if (idMap.hasOwnProperty(shpfid)) {
    const dioceseID = idMap[shpfid];
    if (dioceseInfo.hasOwnProperty(dioceseID)) {
      const { name, alt, province, country_modern } = dioceseInfo[dioceseID];
      const diocese = alt ? `${name} (${alt})` : name;
      info.diocese = diocese;
      info.province = province;
      info.country = country_modern;
    }

    if (mappingData && mappingData.hasOwnProperty(dioceseID)) {
      info.hasMappingData = true;
      info.searchData = mappingData[dioceseID];
      info.query = mappingData.searchTerm;
    }
  }
  return info;
};

export default GeoJSONLayer;
