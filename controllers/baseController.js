const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const baseController = {}

baseController.buildHome = async function(req, res) {
    try{
    nav = await utilities.getNav() 
    req.flash("notice", "This is a flash message.")

   
    res.render("index", 
        {title: "Home",nav})
} catch(error) {
next(error)
}
}

module.exports = baseController

