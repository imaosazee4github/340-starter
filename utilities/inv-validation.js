const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .notEmpty()
        .isAlphanumeric()
        .withMessage("Classification name must not contain spaces or special characters.")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const result = validationResult(req)

  if (!result.isEmpty()) {
    const errors = result.array()
    let nav = await utilities.getNav()

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors,  // Pass as array
      classification_name,
    })
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required"),
    body("inv_model").trim().notEmpty().withMessage("Model is required"),
    body("inv_year").isInt({ min: 1886 }).withMessage("Please enter a valid year"),
    body("inv_price").isFloat({ min: 0 }).withMessage("Please enter a valid price"),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a number"),
    body("inv_color").trim().notEmpty().withMessage("Color is required"),
    body("classification_id").notEmpty().withMessage("Please select a classification"),
    body("inv_description").trim().notEmpty().withMessage("Description is required")
  ]
}


validate.checkInventoryData = async (req, res, next) => {
  const result = validationResult(req)
  
  if (!result.isEmpty()) {

    
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    
//     // ALWAYS pass errors as an array
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: result.array(),  // Must be an array
      inv_make: req.body.inv_make || '',
      inv_model: req.body.inv_model || '',
      inv_year: req.body.inv_year || '',
      inv_description: req.body.inv_description || '',
      inv_image: req.body.inv_image || '/images/vehicles/no-image.png',
      inv_thumbnail: req.body.inv_thumbnail || '/images/vehicles/no-image-tn.png',
      inv_price: req.body.inv_price || '',
      inv_miles: req.body.inv_miles || '',
      inv_color: req.body.inv_color || '',
      classification_id: req.body.classification_id || ''
    })
  }
  
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)

     return res.render("inventory/edit-inventory", {
      title: "Edit Vehicle",
      nav,
      classificationList,
      errors: result.array(),


      inv_id: req.body.inv_id,

      inv_make: req.body.inv_make || '',
      inv_model: req.body.inv_model || '',
      inv_year: req.body.inv_year || '',
      inv_description: req.body.inv_description || '',
      inv_image: req.body.inv_image || '/images/vehicles/no-image.png',
      inv_thumbnail: req.body.inv_thumbnail || '/images/vehicles/no-image-tn.png',
      inv_price: req.body.inv_price || '',
      inv_miles: req.body.inv_miles || '',
      inv_color: req.body.inv_color || '',
      classification_id: req.body.classification_id || ''
     })
    }
    next()
  }

module.exports = validate