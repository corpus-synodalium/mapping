import centroid from '@turf/centroid';
import { isInDatabase } from './cosyn-utils';
import SHAPE_TO_JUR_ID from '../assets/id_map.json';

export const calculateDioceseCentroids = (geojson) => {
  return geojson.features.reduce((centroids, feature) => {
    if (
      feature.geometry.type === 'Polygon' &&
      isInDatabase(feature.properties.SHPFID)
    ) {
      const c = centroid(feature);
      const long = c.geometry.coordinates[0];
      const lat = c.geometry.coordinates[1];
      return centroids.concat([
        {
          lat,
          long,
          shapeID: feature.properties.SHPFID,
        },
      ]);
    } else {
      return centroids;
    }
  }, []);
};

export const getRadius = (shapeID, mappingData, maxNumEntries) => {
  const MIN_RADIUS_PX = 5;
  const MAX_RADIUS_PX = 25;
  if (mappingData) {
    const jurID = SHAPE_TO_JUR_ID[shapeID];
    if (mappingData.hasOwnProperty(jurID)) {
      const numEntries = mappingData[jurID].length;
      return (
        MIN_RADIUS_PX + Math.ceil((MAX_RADIUS_PX * numEntries) / maxNumEntries)
      );
    }
  }
  return 0;
};

// Returns a color of the polygon based on the number of hits
export const getColor = (shapeID, colors, mappingData, maxNumEntries) => {
  if (mappingData) {
    const jurID = SHAPE_TO_JUR_ID[shapeID];
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
export const getHighlightStyle = (feature, showStripedRegions) => {
  if (isInDatabase(feature.properties.SHPFID)) {
    return {
      weight: 2,
      color: 'black',
      dashArray: '',
      fillOpacity: 1.0,
    };
  }
  return {
    weight: showStripedRegions ? 0.5 : 0,
    color: 'black',
    dashArray: '3',
    fillOpacity: showStripedRegions ? 1.0 : 0,
  };
};
