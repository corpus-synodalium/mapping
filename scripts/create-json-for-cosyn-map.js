/**
 * Developed in node version "v12.14.0" (node -v)
 */

// https://csv.js.org/parse/api/sync/
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const config = require('./config');

/**
 * Parse CSV file content and write an output json file
 *
 * @param {Buffer} csvData - CSV file buffer from fs.readFile
 * @param {Array<string>} columnNames - Array of column header names (i.e. the first row of a CSV file)
 * @param {string} idKeyStr - String which indicates the key to use in the output object (e.g. "dioceseId", "provinceId")
 * @param {boolean} isShapeFile - working with shape file Ids?
 */
function parseCSV(csvData, columnNames, idKeyStr, isShapeFile) {
    const parserOptions = {
        columns: columnNames
    };
    const _csvParserOutput = parse(csvData, parserOptions);

    // Note: csvParserOutput will be an array of objects
    // console.log(_csvParserOutput);

    // Remove the first row in csv file
    const csvParserOutput = _csvParserOutput.slice(1);

    // Sort by id number
    csvParserOutput.sort((provinceA, provinceB) => {
        // e.g. "D012" => 12
        const getNumId = idStr => Number(idStr.substring(1));
        const numA = getNumId(provinceA[idKeyStr]);
        const numB = getNumId(provinceB[idKeyStr]);
        return numA - numB;
    });

    // Transform array into an object
    // Maps from id string to diocese info object
    // { [dioceseId: string]: object }
    return csvParserOutput.reduce((output, region) => {
        const id = region[idKeyStr];
        // Make sure there is no duplicate ids
        if (output.hasOwnProperty(id)) {
            throw new Error(`Duplicate id found: ${id}`);
        }
        return {
            ...output,
            // For shape files, we just want to map from shape_id to diocese_id
            // For diocese and province, we want the whole metadata object
            [id]: isShapeFile ? region.regionId : region
        };
    }, {});
}

/**
 * Parse CSV file and write JSON file
 *
 * @param {string} inputCsvPath   - Path to input csv file
 * @param {string} outputJsonPath - Path to output json file
 * @param {Array<string>} columnNames - Array of column header names (i.e. the first row of a CSV file)
 * @param {string} idKeyStr - String which indicates the key to use in the output object (e.g. "dioceseId", "provinceId")
 * @param {boolean} isShapeFile - working with shape file Ids?
 */
function createJSONFile(
    inputCsvPath,
    outputJsonPath,
    columnNames,
    idKeyStr,
    isShapeFile
) {
    fs.readFile(inputCsvPath, async (err, csvData) => {
        if (err) {
            throw err;
        }

        // Parse CSV
        const outputObj = parseCSV(csvData, columnNames, idKeyStr, isShapeFile);

        // Touch file to make sure it exists
        fs.closeSync(fs.openSync(outputJsonPath, 'a'));

        // Write output JSON file
        fs.writeFile(
            outputJsonPath,
            // JSON string of the final output object
            JSON.stringify(outputObj, null, 2),
            err => {
                if (err) {
                    throw err;
                }
                console.log(
                    `✅ Success! The file has been saved at:\n✅ ${outputJsonPath}`
                );
            }
        );
    });
}

function main() {
    let inputCsvPath;
    let outputJsonPath;
    let columnNames;
    let idKeyStr;
    let isShapeFile = false;

    if (process.argv.slice(2).includes('--diocese')) {
        inputCsvPath = config.INPUT_CSV_DIOCESE;
        outputJsonPath = config.OUTPUT_JSON_DIOCESE;
        columnNames = config.DIOCESE_LIST_COLUMN_NAMES;
        idKeyStr = config.DIOCESE_LIST_COLUMN_NAMES[0]; // 'dioceseId'
    }
    if (process.argv.slice(2).includes('--province')) {
        inputCsvPath = config.INPUT_CSV_PROVINCE;
        outputJsonPath = config.OUTPUT_JSON_PROVINCE;
        columnNames = config.PROVINCE_LIST_COLUMN_NAMES;
        idKeyStr = config.PROVINCE_LIST_COLUMN_NAMES[0]; //'provinceId'
    }
    if (process.argv.slice(2).includes('--shape')) {
        isShapeFile = true;
        inputCsvPath = config.INPUT_CSV_SHAPE_FILES;
        outputJsonPath = config.OUTPUT_JSON_SHAPE_FILES;
        columnNames = config.SHAPE_FILES_COLUMN_NAMES;
        idKeyStr = config.SHAPE_FILES_COLUMN_NAMES[0]; //'shapeFileId'
    }

    createJSONFile(
        inputCsvPath,
        outputJsonPath,
        columnNames,
        idKeyStr,
        isShapeFile
    );
}

main();
