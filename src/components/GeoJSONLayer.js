import React, { Component } from 'react';
import { GeoJSON } from 'react-leaflet';
import s2d from '../assets/s2d.json';
import dioceseInfo from '../assets/diocese_info.json';

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
    const { currentColorScheme } = this.props;
    const colors = colorSchemes[currentColorScheme];
    const { mappingData } = this.props;

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
    return {
      fillColor: this.getColor(feature.properties.SHPFID),
      weight: 1,
      opacity: 3,
      color: 'grey',
      dashArray: '3',
      fillOpacity: 1.0,
    };
  };

  onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.showRecordsModal,
    });
  };

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
    var layer = e.target;
    const info = this.getDioceseData(layer);
    this.props.updateInfo(info);

    layer.setStyle({
      weight: 2,
      color: 'black',
      dashArray: '',
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
      <GeoJSON
        data={this.state.geojson}
        style={this.style}
        onEachFeature={this.onEachFeature}
        ref={this.geojsonRef}
      />
    );
  }
}

export default GeoJSONLayer;
