/**
 * Developed in node version "v12.14.0" (node -v)
 */

// https://csv.js.org/parse/api/sync/
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const INPUT_CSV = __dirname + '/csv/philologic_metadata.csv';
const OUTPUT_JSON = __dirname + '/output/ids-in-database.json';

/**
 * Get a list of unique diocese/province IDs that appear in PhiloLogic database
 *
 * Input CSV should only include id columns.
 *
 * Example:
 *
 * Jurisdiction_ID,Jurisdiction_ID2,Jurisdiction_ID3,Jurisdiction_ID4,Jurisdiction_ID5,Jurisdiction_ID6
 * P067,,,,,
 */
fs.readFile(INPUT_CSV, async (err, csvData) => {
    if (err) {
        throw err;
    }

    // Parse CSV
    let outputArr = parse(csvData);

    // Remove 1st row (header names)
    outputArr = outputArr.slice(1);

    // console.log(outputArr);

    const ids = new Set();

    outputArr.forEach((arr) => {
        arr.forEach((id) => {
            if (id) {
                ids.add(id);
            }
        });
    });

    const sortedIds = [...ids].sort();

    // Touch file to make sure it exists
    fs.closeSync(fs.openSync(OUTPUT_JSON, 'a'));

    // Write output JSON file
    fs.writeFile(
        OUTPUT_JSON,
        // JSON string of the final output object
        JSON.stringify(sortedIds, null, 2),
        (err) => {
            if (err) {
                throw err;
            }
            console.log(
                `✅ Success! The file has been saved at:\n✅ ${OUTPUT_JSON}`
            );
        }
    );
});
