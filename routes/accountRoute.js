const express = require("express")
const regValidate = require("../utilities/account-validation")

const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

const router = new express.Router()

// router.get("/", utilities.handleErrors(accountController.buildAccountManagement))
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Get login view
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))


module.exports = router