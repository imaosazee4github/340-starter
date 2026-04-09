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

module.exports = invCont