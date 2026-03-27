const Pool = require("../database/index")


/* 
 * Get all classification data
*/

async function getClassifications(){
    return await Pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}