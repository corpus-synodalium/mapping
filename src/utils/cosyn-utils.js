import { DIOCESES } from './constants/diocese-info';
import { KNOWN_IDS_IN_DATABASE } from './constants/jurisdiction-ids-in-database';
import { PROVINCES } from './constants/province-info';
import { SHAPE_ID_MAP } from './constants/shape-id-map';

// Returns true if a jurisdiction id appears in database
export const isInDatabase = (shapeID) => {
    const jurID = SHAPE_ID_MAP[shapeID];
    return jurID ? KNOWN_IDS_IN_DATABASE.has(jurID) : false;
};

// Return info to display in info panel
export const getJurisdictionData = (shapeID, mappingData) => {
    const info = {};
    if (SHAPE_ID_MAP.hasOwnProperty(shapeID)) {
        const jurID = SHAPE_ID_MAP[shapeID];

        if (DIOCESES.hasOwnProperty(jurID)) {
            const {
                diocsesName,
                diocsesNameAlt,
                province,
                countryModern,
            } = DIOCESES[jurID];
            info.title = diocsesNameAlt
                ? `${diocsesName} (${diocsesNameAlt})`
                : diocsesName;
            info.province = province;
            info.country = countryModern;
        } else if (PROVINCES.hasOwnProperty(jurID)) {
            const { provinceName, provinceNameAlt } = PROVINCES[jurID];
            let title = provinceNameAlt
                ? `${provinceName} (${provinceNameAlt})`
                : provinceName;
            title += ' (Province)';
            info.title = title;
        }

        if (mappingData && mappingData.hasOwnProperty(jurID)) {
            info.hasMappingData = true;
            info.searchData = mappingData[jurID];
            info.query = mappingData.searchTerm;
        }
    }
    return info;
};
