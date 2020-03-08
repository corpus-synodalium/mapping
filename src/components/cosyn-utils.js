import SHAPE_TO_JUR_ID from '../assets/id_map.json';
import JUR_IDS_IN_DB from '../assets/jurisdiction_ids_in_database.json';
import DIOCESE_INFO from '../assets/diocese_info.json';
import PROVINCE_INFO from '../assets/province_info.json';

// Returns true if a jurisdiction id appears in database
export const isInDatabase = (shapeID) => {
  const jurID = SHAPE_TO_JUR_ID[shapeID];
  return JUR_IDS_IN_DB.indexOf(jurID) >= 0;
};

// Return info to display in info panel
export const getJurisdictionData = (shapeID, mappingData) => {
  const info = {};
  if (SHAPE_TO_JUR_ID.hasOwnProperty(shapeID)) {
    const jurID = SHAPE_TO_JUR_ID[shapeID];

    if (DIOCESE_INFO.hasOwnProperty(jurID)) {
      const { name, alt, province, country_modern } = DIOCESE_INFO[jurID];
      info.title = alt ? `${name} (${alt})` : name;
      info.province = province;
      info.country = country_modern;
    } else if (PROVINCE_INFO.hasOwnProperty(jurID)) {
      const { name, alt } = PROVINCE_INFO[jurID];
      let title = alt ? `${name} (${alt})` : name;
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
