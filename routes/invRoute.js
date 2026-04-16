const express = require("express")
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")



const router = new express.Router() 



router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.post(
  "/add-inventory", 
    utilities.checkLogin,
    utilities.checkEmployeeOrAdmin,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData, 
    utilities.handleErrors(invController.addInventory)
)

router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.post("/delete", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventory))

router.get("/", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", utilities.checkLogin,  utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.get( "/add-inventory", utilities.checkLogin, utilities.checkEmployeeOrAdmin,  utilities.handleErrors(invController.buildAddInventory))
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkEmployeeOrAdmin,  utilities.handleErrors(invController.buildDeleteView))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));
router.get("/getInventory/:classification_id",   utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.editInventoryView))


router.get("/error", utilities.handleErrors(invController.triggerError));

module.exports = router;