import React from 'react';
import { CircleMarker } from 'react-leaflet';
import { getJurisdictionData } from './cosyn-utils';
import { getRadius } from './mapping-utils';

export const DioceseCentroids = ({
  centroids,
  updateInfo,
  mappingData,
  maxNumEntries,
  showRecordsModal,
}) => {
  const handleMouseOver = (e) => {
    const layer = e.target;
    const info = getJurisdictionData(layer.options.shapeID, mappingData);
    updateInfo(info);
  };
  const handleMouseOut = () => {
    updateInfo(null);
  };
  const handleClick = (e) => {
    const layer = e.target;
    const info = getJurisdictionData(layer.options.shapeID, mappingData);
    if (info.hasMappingData) {
      showRecordsModal(info);
    }
  };

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
        fillColor="#3388ff"
        fillOpacity={0.9}
        stroke={true}
        color="#fff"
        weight={1}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        shapeID={shapeID}
      />
    );
  });

  return <div>{circles}</div>;
};
