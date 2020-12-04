const config = {};

/**
 * Path to csv file (diocese list)
 */
config.INPUT_CSV_DIOCESE = __dirname + '/csv/d.csv';

/**
 * Path to csv file (provinces list)
 */
config.INPUT_CSV_PROVINCE = __dirname + '/csv/p.csv';

/**
 * Path to csv file (shape file ids)
 */
config.INPUT_CSV_SHAPE_FILES = __dirname + '/csv/shape_id.csv';

/**
 * Path to output diocese json file
 */
config.OUTPUT_JSON_DIOCESE = __dirname + '/output/diocese_data.json';

/**
 * Path to output province json file
 */
config.OUTPUT_JSON_PROVINCE = __dirname + '/output/province_data.json';

/**
 * Path to output json file (shapefile id to diocese/province id)
 */
config.OUTPUT_JSON_SHAPE_FILES = __dirname + '/output/shapefile_data.json';

/**
 * Ordered list of column names (i.e. first row of CSV file)
 * (Renamed to camelCase)
 */
config.PROVINCE_LIST_COLUMN_NAMES = [
    'provinceId',
    'provinceName',
    'provinceNameAlt',
    'shapeFileId',
    'shapeFileId2',
    'shapeFileId3',
    'shapeFileId4',
    'yearFounded',
    'yearSuppressed',
    'notes',
];

/**
 * Ordered list of column names (i.e. first row of CSV file)
 * (Renamed to camelCase)
 */
config.DIOCESE_LIST_COLUMN_NAMES = [
    'dioceseId',
    'diocsesName',
    'diocsesNameAlt',
    'province',
    'province2',
    'province3',
    'countryModern',
    'shapeFileId',
    'shapeFileId2',
    'shapeFileId3',
    'shapeFileId4',
    'yearFounded',
    'yearSuppressed',
    'notes',
];

config.SHAPE_FILES_COLUMN_NAMES = [
    'shapeFileId',
    'regionId',
    // Note: We only care about the first 2 columns for shape files
    'regionName',
    'countryModern',
    'startDate',
    'endDate',
    'startDate2',
    'endDate2',
    'UnionWith1_Name',
    'UnionWith1_ShpFID',
    'UnionStart1',
    'UnionEnd1',
    'UnionWith2_Name',
    'UnionWith2_ShpFID',
    'UnionStart2',
    'UnionEnd2',
    'notes',
];

module.exports = {
    ...config,
};
