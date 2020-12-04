import React, { Component } from 'react';
import { LayerGroup } from 'react-leaflet';
import { GeoJSONFillable, Patterns } from 'react-leaflet-geojson-patterns';
import {
    DIOCESE,
    DIOCESE_PROVINCE,
    PROVINCE,
} from '../utils/constants/cosyn-constants';
import { getJurisdictionData, isInDatabase } from '../utils/cosyn-utils';
import {
    calculateDioceseCentroids,
    getColor,
    getHighlightStyle,
    getShapeFileId,
} from '../utils/mapping-utils';
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
        if (isInDatabase(getShapeFileId(feature))) {
            const { colorSchemes } = this.props.config;
            const {
                mappingData,
                currentColorScheme,
                maxNumEntries,
            } = this.props;
            const colors = colorSchemes[currentColorScheme];
            const shapeID = getShapeFileId(feature);
            return {
                fillColor: getColor(
                    shapeID,
                    colors,
                    mappingData,
                    maxNumEntries
                ),
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
            isInDatabase(getShapeFileId(layer.feature)) ||
            this.props.showStripedRegions
        ) {
            const info = getJurisdictionData(
                getShapeFileId(layer.feature),
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
            getShapeFileId(layer.feature),
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

        const { layerViewMode } = this.props;

        return (
            <div>
                {layerViewMode === DIOCESE && (
                    <GeoJSONFillable
                        data={this.state.diocese_geojson}
                        style={this.style}
                        onEachFeature={this.onEachFeatureDiocese}
                        ref={this.dioceseRef}
                    />
                )}
                {layerViewMode === PROVINCE && (
                    <GeoJSONFillable
                        data={this.state.province_geojson}
                        style={this.style}
                        onEachFeature={this.onEachFeatureProvince}
                        ref={this.provinceRef}
                    />
                )}
                {layerViewMode === DIOCESE_PROVINCE && (
                    <LayerGroup>
                        <GeoJSONFillable
                            data={this.state.province_geojson}
                            style={this.style}
                            onEachFeature={this.onEachFeatureProvince}
                            ref={this.provinceRef}
                        />
                        {this.props.mappingData ? (
                            <DioceseCentroids
                                centroids={this.state.dioceseCentroids}
                                updateInfo={this.props.updateInfo}
                                mappingData={this.props.mappingData}
                                maxNumEntries={this.props.maxNumEntries}
                                showRecordsModal={this.props.showRecordsModal}
                            />
                        ) : null}
                    </LayerGroup>
                )}
            </div>
        );
    }
}
export default GeoJSONLayer;
