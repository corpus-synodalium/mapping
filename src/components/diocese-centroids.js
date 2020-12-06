import React, { Component } from 'react';
import { CircleMarker } from 'react-leaflet';
import { getJurisdictionData } from '../utils/cosyn-utils';
import { getRadius } from '../utils/mapping-utils';

const NORMAL_OPACITY = 0.8;
const FOCUS_OPACITY = 1.0;

export class DioceseCentroids extends Component {
    handleMouseOver = (e) => {
        const layer = e.target;
        layer.setStyle({
            fillOpacity: FOCUS_OPACITY,
            weight: 3,
        });
        const info = getJurisdictionData(
            layer.options.shapeID,
            this.props.mappingData
        );
        this.props.updateInfo(info);
    };
    handleMouseOut = (e) => {
        const layer = e.target;
        layer.setStyle({
            fillOpacity: NORMAL_OPACITY,
            weight: 1,
        });
        this.props.updateInfo(null);
    };
    handleClick = (e) => {
        const layer = e.target;
        const info = getJurisdictionData(
            layer.options.shapeID,
            this.props.mappingData
        );
        if (info.hasMappingData) {
            this.props.showRecordsModal(info);
        }
    };

    render() {
        // TODO: Optimize re-renders
        // Right now, it's rendering every time you hover over a region.
        // console.log('DioceseCentroids re-rendered');

        const { centroids, mappingData, maxNumEntries, fillColor } = this.props;

        const circles = centroids.map((centroid, index) => {
            const { lat, long, shapeID } = centroid;

            const radius = getRadius(shapeID, mappingData, maxNumEntries);

            if (radius === 0) {
                return null;
            }

            return (
                <CircleMarker
                    key={index}
                    center={[lat, long]}
                    radius={radius}
                    fillColor={fillColor}
                    fillOpacity={NORMAL_OPACITY}
                    stroke={true}
                    color="#fff"
                    weight={1}
                    onClick={this.handleClick}
                    onMouseOver={this.handleMouseOver}
                    onMouseOut={this.handleMouseOut}
                    shapeID={shapeID} // This is read later in layer.options.shapeID in mouseover
                />
            );
        });
        return <>{circles}</>;
    }
}
