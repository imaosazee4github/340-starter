const utilities = require("../utilities")
const invModel = require("../models/inventory-model")



const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    // const nav = await utilities.getNav()

// prevent or handle crash
    if (!data || data.length === 0){
      return res.status(404).render("errors/error", {
        title: "No Vehicles Found",
        message: "Sorry, no vehicles found for this classification.",
      })
    }
    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      grid
    })

  }catch(error){
    next(error)
  }
}

// Build vehicle detail view

invCont.buildByInventoryId = async function (req, res, next){
  try {
    const inv_id = parseInt(req.params.inv_id)

    if (isNaN(inv_id)) {
      return res.status(400).render("errors/error", {
        title: "Invalid ID",
        message: "Invalid vehicle ID provided."
      })
    }
    const data = await invModel.getInventoryById(inv_id)

    // const nav = await utilities.getNav()
    if(!data) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, that vehicle does not exist.",
      })
    }

    const grid = await utilities.buildVehicleDetail(data)
    const itemName = `${data.inv_make} ${data.inv_model}`

    res.render("inventory/detail", {
      title: itemName,
      grid
    })
  }catch(error){
    next(error)
  }
}

invCont.triggerError = async function(req, res, next) {
  try {
    throw new Error("Intentional 500 error");
  } catch (error) {
    next(error);
  }
}

async function buildManagement(req, res, next){
  try{
    let nav = await utilities.getNav()

    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title :"Inventory/management",
      nav,
      classificationSelect
    })
  }catch(error){
    next(error)
  }
}

invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)

    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No inventory found" })
    }

    return res.json(data)

  } catch (error) {
    next(error)
  }
}


async function buildAddClassification(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

async function addClassification(req, res, next){
  try{
    let nav = await utilities.getNav()
    const {classification_name} = req.body

    const result = await invModel.addClassification(classification_name)

    // Check if result has rowCount or if it's an error message
    if (result && result.rowCount > 0) {
      req.flash("notice", "Classification added successfully.")
      return res.redirect("/inv")  // Use redirect, not render
    } else {
      req.flash("notice", "Failed to add classification. Classification may already exist.")
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: [{ msg: result || "Database error" }],
        classification_name,
      })
    }
  }catch(error){
    next(error)
  }
}


async function buildAddInventory(req, res, next) {
  try {
    console.log('=== buildAddInventory called ===')
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: [],  // Pass empty array, NOT null
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: '',
      inv_miles: '',
      inv_color: ''
    })
  } catch (error) {
    console.error('Error in buildAddInventory:', error)
    next(error)
  }
}

async function addInventory(req, res, next) {
  try {
    let nav = await utilities.getNav()

    const {
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
    } = req.body

    const result = await invModel.addInventory(
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
    )

    // Check if result has rowCount (successful insert)
    if (result && result.rowCount > 0) {
      req.flash("notice", "Vehicle added successfully.")
      return res.redirect("/inv")  // Use redirect to management view
    } else {
      req.flash("notice", "Failed to add vehicle. Please try again.")
      let classificationList = await utilities.buildClassificationList(classification_id)
      
      // Re-render form with entered data
      return res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: [{ msg: result || "Database error - could not add vehicle" }],
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
      })
    }

  } catch (error) {
    console.error("Error in addInventory:", error)
    req.flash("notice", "An error occurred while adding the vehicle.")
    next(error)
  }
}

invCont.editInventoryView = async function(req, res, next){
  try{
      const inv_id = parseInt(req.params.inv_id)

    let nav = await utilities.getNav()

    // Get item data from DB
    const itemData = await invModel.getInventoryById(inv_id)

    if (!itemData) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv")
    }
      // Build dropdown with selected classification
    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id
    )

    // Build title
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
       // Pass all values to view
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })

  }catch(error){
    next(error)
  }
  
}

/* ***************************
 * Update Inventory Data
 * ************************** */
async function updateInventory(req, res, next) {
  try {
    let nav = await utilities.getNav()

    const {
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
    } = req.body

    const result = await invModel.updateInventory(
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
    )

    if (result && result.rowCount > 0) {
      req.flash("notice", "Vehicle updated successfully.")
      return res.redirect("/inv")
    } else {
      req.flash("notice", "Update failed.")
      let classificationSelect = await utilities.buildClassificationList(classification_id)

      return res.render("inventory/edit-inventory", {
        title: "Edit Vehicle",
        nav,
        classificationSelect,
        errors: [{ msg: "Update failed." }],
        ...req.body
      })
    }

  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildByClassificationId: invCont.buildByClassificationId,
  buildByInventoryId: invCont.buildByInventoryId,
  triggerError: invCont.triggerError,
  buildManagement,
  getInventoryJSON: invCont.getInventoryJSON,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  updateInventory,
  editInventoryView: invCont.editInventoryView
}