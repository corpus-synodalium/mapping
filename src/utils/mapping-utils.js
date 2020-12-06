import centroid from '@turf/centroid';
import { SHAPE_ID_MAP } from './constants/shape-id-map';
import { isInDatabase } from './cosyn-utils';

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

// Return the radius of a diocese circle based on the number of hits
export const getRadius = (shapeID, mappingData, maxNumEntries) => {
    const MIN_RADIUS_PX = 5;
    const MAX_RADIUS_PX = 15;
    if (mappingData) {
        const jurID = SHAPE_ID_MAP[shapeID];
        if (mappingData.hasOwnProperty(jurID)) {
            const numEntries = mappingData[jurID].length;
            return (
                MIN_RADIUS_PX +
                Math.ceil((MAX_RADIUS_PX * numEntries) / maxNumEntries)
            );
        }
    }
    return 0;
};

// Returns a color of the polygon based on the number of hits
export const getColor = (shapeID, colors, mappingData, maxNumEntries) => {
    if (mappingData) {
        const jurID = SHAPE_ID_MAP[shapeID];
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
    if (isInDatabase(getShapeFileId(feature))) {
        return {
            weight: 2,
            color: 'black',
            dashArray: '',
            fillOpacity: 1,
        };
    }
    return {
        weight: showStripedRegions ? 1 : 0,
        color: 'black',
        dashArray: '3',
        fillOpacity: showStripedRegions ? 1 : 0,
    };
};

// Helper function to trim whitespace from shape file ids
export const getShapeFileId = (feature) => {
    let id;
    if (feature.properties) {
        // TODO (in geojson files): GeoJSON files for diocese and province should have consistent names
        id = feature.properties.SHPFID || feature.properties.ShpfId;
    }
    return id ? id.trim() : null;
};
