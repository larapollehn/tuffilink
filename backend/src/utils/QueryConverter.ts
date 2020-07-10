/**
 * formats the result of querying the click counts of a url
 * @param queryResult
 */
export default function queryConvert(queryResult) {
    const result = [];
    for (let i = 0; i < queryResult.rows.length; i++){
        const obj = {};
        for(let j = 0; j < queryResult.fields.length; j++){
            obj[queryResult.fields[j].name] = queryResult.rows[i][j];
        }
        result.push(obj);
    }
    return result;
}
