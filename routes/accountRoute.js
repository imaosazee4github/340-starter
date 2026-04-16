const express = require("express")
const regValidate = require("../utilities/account-validation")
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

const router = new express.Router()


router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

router.get(
    "/update/:id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)

router.post(
    "/update-info",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccountInfo)
)

router.post(
    "/change-password",
    utilities.checkLogin,
    regValidate.changePasswordRules(),
    regValidate.checkChangePasswordData,
    utilities.handleErrors(accountController.changePassword)
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
})

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