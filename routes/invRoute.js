const express = require("express")
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")



const router = new express.Router() 



router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.post("/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,  // This is where the error occurs
    utilities.handleErrors(invController.addInventory)
)

router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get("/", utilities.handleErrors(invController.buildManagement))
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification))
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
     "/edit/:inv_id",
     utilities.handleErrors(invController.editInventoryView)
)

router.post(
  "/update",
  utilities.handleErrors(invController.updateInventory)
)

router.get("/error", utilities.handleErrors(invController.triggerError));



module.exports = router;