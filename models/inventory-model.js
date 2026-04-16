const pool = require("../database/index")


/* 
 * Get all classification data
*/
async function getClassifications(){
    try{
        const data = await pool.query(
            "SELECT * FROM public.classification ORDER BY classification_name"
        )
        return data.rows
    }catch (error) {
        console.error("Error fetching classification:", error)
        return {rows: []}
    }
    // return await Pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    return []
  }
}

async function getInventoryById(inv_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  }catch (error){
    console.error("getInventoryById error" + error)
    return null
  }
}

async function addClassification(classification_name) {
  try{
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  }catch(error) {
    return error.message
  }
}

// async function addInventory(
//   inv_make,
//   inv_model,
//   inv_year,
//   inv_description,
//   inv_image,
//   inv_thumbnail,
//   inv_price,
//   inv_miles,
//   inv_color,
//   classification_id
// ) {
//   try {
//     const sql = `
//       INSERT INTO inventory 
//       (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
//       RETURNING *`

//     return await pool.query(sql, [
//       inv_make,
//       inv_model,
//       inv_year,
//       inv_description,
//       inv_image,
//       inv_thumbnail,
//       inv_price,
//       inv_miles,
//       inv_color,
//       classification_id
//     ])
//   } catch (error) {
//     return error.message
//   }
// }

async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      INSERT INTO inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`

    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    ])
    return result  // Return the full result object with rowCount
  } catch (error) {
    console.error("Error in addInventory:", error)
    return { rowCount: 0, error: error.message}  // Return consistent object
  }
}

async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
){
  try {
    const sql =`
    UPDATE public.inventory
    SET inv_make = $1,
          inv_model = $2,
          inv_year = $3,
          inv_description = $4,
          inv_image = $5,
          inv_thumbnail = $6,
          inv_price = $7,
          inv_miles = $8,
          inv_color = $9,
          classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return result
  }catch(error){
    console.error("updateInventory error:", error)
    return {rowCount: 0, error: error.message}
  }
}
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory, updateInventory}