import React, { Component } from 'react';
import { GeoJSONFillable, Patterns } from 'react-leaflet-geojson-patterns';
import s2d from '../assets/s2d.json';
import dioceseInfo from '../assets/diocese_info.json';
import databaseJurIDs from '../assets/jurisdiction_ids_in_database.json';

class GeoJSONLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geojson: null,
      isLoading: true,
    };
    this.geojsonRef = React.createRef();
    this.shapeToDiocese = s2d.map;
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_GEOJSON_URL)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          geojson: data,
          isLoading: false,
        });
      });
  }

  getColor(shpfid) {
    const { colorSchemes } = this.props.config;
    const { mappingData, currentColorScheme } = this.props;
    const colors = colorSchemes[currentColorScheme];

    if (mappingData) {
      const dioceseID = this.shapeToDiocese[shpfid];
      const maxNumEntries = this.props.maxNumEntries;
      const numPerBucket = Math.ceil(maxNumEntries / colors.length);
      if (mappingData.hasOwnProperty(dioceseID)) {
        const numEntries = mappingData[dioceseID].length;
        let index = Math.floor((numEntries - 1) / numPerBucket);
        if (index > colors.length - 1) {
          index = colors.length - 1;
        }
        return colors[index];
      }
    }
    return '#fff';
  }

  style = (feature) => {
    if (_inDatabase(feature)) {
      return {
        fillColor: this.getColor(feature.properties.SHPFID),
        fillOpacity: 1.0,
        weight: 1,
        opacity: 3,
        color: 'grey',
        dashArray: '',
      };
    }

    return {
      fillColor: '#fff',
      fillOpacity: 0.8,
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

  // TODO: update for provinces
  getDioceseData = (layer) => {
    const { SHPFID: shpfid } = layer.feature.properties;
    const { mappingData } = this.props;
    const info = {};
    if (this.shapeToDiocese.hasOwnProperty(shpfid)) {
      const dioceseID = this.shapeToDiocese[shpfid];
      if (dioceseInfo.hasOwnProperty(dioceseID)) {
        const {
          diocese_name,
          diocese_alt,
          province,
          country_modern,
        } = dioceseInfo[dioceseID];
        const diocese = diocese_alt
          ? `${diocese_name} (${diocese_alt})`
          : diocese_name;
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

  highlightFeature = (e) => {
    const layer = e.target;
    const info = this.getDioceseData(layer);
    this.props.updateInfo(info);
    let weight = 0.5;
    let dashArray = '3';
    if (_inDatabase(layer.feature)) {
      weight = 2.0;
      dashArray = '';
    }
    layer.setStyle({
      weight: weight,
      color: 'black',
      dashArray: dashArray,
      fillOpacity: 1.0,
    });
    layer.bringToFront();
  };

  resetHighlight = (e) => {
    const { leafletElement } = this.geojsonRef.current;
    leafletElement.resetStyle(e.target);
    this.props.updateInfo(null);
  };

  showRecordsModal = (e) => {
    var layer = e.target;
    const info = this.getDioceseData(layer);
    if (info.hasMappingData) {
      this.props.showRecordsModal(info);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <span />;
    }
    return (
      <GeoJSONFillable
        data={this.state.geojson}
        style={this.style}
        onEachFeature={this.onEachFeature}
        ref={this.geojsonRef}
      />
    );
  }
}

// Returns true if a jurisdiction id appears in database
const _inDatabase = (feature) => {
  const shape_id = feature.properties.SHPFID;
  const diocese_id = s2d.map[shape_id];
  return databaseJurIDs.indexOf(diocese_id) >= 0;
};

export default GeoJSONLayer;
