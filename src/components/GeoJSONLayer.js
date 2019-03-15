import React, { Component } from 'react';
import { GeoJSONFillable, Patterns } from 'react-leaflet-geojson-patterns';
import idMap from '../assets/id_map.json';
import dioceseInfo from '../assets/diocese_info.json';
import provinceInfo from '../assets/province_info.json';
import databaseJurIDs from '../assets/jurisdiction_ids_in_database.json';

class GeoJSONLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diocese_geojson: null,
      province_geojson: null,
      isLoading: true,
    };
    this.dioceseRef = React.createRef();
    this.provinceRef = React.createRef();
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

  onEachFeatureDiocese = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlightDiocese,
      click: this.showRecordsModal,
    });
  };

  onEachFeatureProvince = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlightProvince,
      click: this.showRecordsModal,
    });
  };

  highlightFeature = (e) => {
    const layer = e.target;
    if (_inDatabase(layer.feature) || this.props.showStripedRegions) {
      const info = _getJurisdictionData(layer, this.props.mappingData);
      this.props.updateInfo(info);
    }

    const style = _getHighlightStyle(
      layer.feature,
      this.props.showStripedRegions
    );
    layer.setStyle(style);
    layer.bringToFront();
  };

  resetHighlightDiocese = (e) => {
    const { leafletElement } = this.dioceseRef.current;
    leafletElement.resetStyle(e.target);
    this.props.updateInfo(null);
  };

  resetHighlightProvince = (e) => {
    const { leafletElement } = this.provinceRef.current;
    leafletElement.resetStyle(e.target);
    this.props.updateInfo(null);
  };

  showRecordsModal = (e) => {
    var layer = e.target;
    const info = _getJurisdictionData(layer, this.props.mappingData);
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
        {this.props.showProvinces && (
          <GeoJSONFillable
            data={this.state.province_geojson}
            style={this.style}
            onEachFeature={this.onEachFeatureProvince}
            ref={this.provinceRef}
          />
        )}
        {this.props.showDioceses && (
          <GeoJSONFillable
            data={this.state.diocese_geojson}
            style={this.style}
            onEachFeature={this.onEachFeatureDiocese}
            ref={this.dioceseRef}
          />
        )}
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

// Returns the style on mouse hover
const _getHighlightStyle = (feature, showStripedRegions) => {
  let style;
  if (_inDatabase(feature)) {
    style = {
      weight: 2,
      color: 'black',
      dashArray: '',
      fillOpacity: 1.0,
    };
  } else {
    style = {
      weight: showStripedRegions ? 0.5 : 0,
      color: 'black',
      dashArray: '3',
      fillOpacity: showStripedRegions ? 1.0 : 0,
    };
  }
  return style;
};

// Returns true if a jurisdiction id appears in database
const _inDatabase = (feature) => {
  const shapeID = feature.properties.SHPFID;
  const jurID = idMap[shapeID];
  return databaseJurIDs.indexOf(jurID) >= 0;
};

// Get metadata and mapping data of a shape file
const _getJurisdictionData = (layer, mappingData) => {
  const { SHPFID: shpfid } = layer.feature.properties;
  const info = {};
  if (idMap.hasOwnProperty(shpfid)) {
    const jurID = idMap[shpfid];

    if (dioceseInfo.hasOwnProperty(jurID)) {
      const { name, alt, province, country_modern } = dioceseInfo[jurID];
      info.title = alt ? `${name} (${alt})` : name;
      info.province = province;
      info.country = country_modern;
    } else if (provinceInfo.hasOwnProperty(jurID)) {
      const { name, alt } = provinceInfo[jurID];
      info.title = alt ? `${name} (${alt})` : name;
    }

    if (mappingData && mappingData.hasOwnProperty(jurID)) {
      info.hasMappingData = true;
      info.searchData = mappingData[jurID];
      info.query = mappingData.searchTerm;
    }
  }
  return info;
};

export default GeoJSONLayer;
