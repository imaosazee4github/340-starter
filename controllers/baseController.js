const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const baseController = {}

baseController.buildHome = async function(req, res, next) {
    try{
    const nav = await utilities.getNav() 
} catch(error) {
next(error)
}
}

module.exports = baseController

