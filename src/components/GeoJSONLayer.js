import React, { Component } from 'react';
import { GeoJSONFillable, Patterns } from 'react-leaflet-geojson-patterns';
import {
  calculateDioceseCentroids,
  getColor,
  getHighlightStyle,
} from './mapping-utils';
import { isInDatabase, getJurisdictionData } from './cosyn-utils';
import { DioceseCentroids } from './diocese-centroids';

class GeoJSONLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dioceseCentroids: null,
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
        const centroids = calculateDioceseCentroids(data);
        this.setState({
          dioceseCentroids: centroids,
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
    if (isInDatabase(feature.properties.SHPFID)) {
      const { colorSchemes } = this.props.config;
      const { mappingData, currentColorScheme, maxNumEntries } = this.props;
      const colors = colorSchemes[currentColorScheme];
      const shapeID = feature.properties.SHPFID;
      return {
        fillColor: getColor(shapeID, colors, mappingData, maxNumEntries),
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
    if (
      isInDatabase(layer.feature.properties.SHPFID) ||
      this.props.showStripedRegions
    ) {
      const info = getJurisdictionData(
        layer.feature.properties.SHPFID,
        this.props.mappingData
      );
      this.props.updateInfo(info);
    }

    const style = getHighlightStyle(
      layer.feature,
      this.props.showStripedRegions
    );
    layer.setStyle(style);
    // layer.bringToFront();
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
    const info = getJurisdictionData(
      layer.feature.properties.SHPFID,
      this.props.mappingData
    );
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
        {this.props.showDioceses && (
          <DioceseCentroids
            centroids={this.state.dioceseCentroids}
            updateInfo={this.props.updateInfo}
            mappingData={this.props.mappingData}
            maxNumEntries={this.props.maxNumEntries}
            showRecordsModal={this.props.showRecordsModal}
          />
        )}
        {this.props.showProvinces && (
          <GeoJSONFillable
            data={this.state.province_geojson}
            style={this.style}
            onEachFeature={this.onEachFeatureProvince}
            ref={this.provinceRef}
          />
        )}
      </div>
    );
  }
}

// {this.props.showDioceses && (
//   <GeoJSONFillable
//     data={this.state.diocese_geojson}
//     style={this.style}
//     onEachFeature={this.onEachFeatureDiocese}
//     ref={this.dioceseRef}
//   />
// )}

export default GeoJSONLayer;
