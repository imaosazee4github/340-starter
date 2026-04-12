const express = require("express")
const regValidate = require("../utilities/account-validation")

const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

const router = new express.Router()

// Get login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

router.post("/login", (req, res) => {
    res.status(200).send("login process")
})

module.exports = router