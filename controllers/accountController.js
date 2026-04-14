const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const accountController = {}

// Login user controller
accountController.buildLogin = async function(req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email: ""
        })
    } catch(error) {
        next(error)
    }
}

// Register user controller
accountController.buildRegister = async function(req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("account/register", {
            title: "Register",
            nav,
            errors: null,
            account_firstname: "",
            account_lastname: "",
            account_email: ""
        })
    } catch(error) {
        next(error)
    }
}

// Process registration
accountController.registerAccount = async function(req, res, next) {
    let nav = await utilities.getNav()
    
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password
    } = req.body

    try {
        // Hash the password - FIXED: Use bcrypt.hashSync correctly
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(account_password, salt)

        // Register the account
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        )

        if (regResult && regResult.rowCount > 0) {
            req.flash("notice", `Congratulations ${account_firstname}, you're registered! Please log in.`)
            return res.redirect("/account/login")  // Use redirect, not render
        } else {
            req.flash("notice", "Sorry, the registration failed. Please try again.")
            return res.render("account/register", {
                title: "Register",
                nav,
                errors: [{ msg: "Registration failed. Please try again." }],
                account_firstname,
                account_lastname,
                account_email
            })
        }
    } catch(error) {
        console.error("Register Error:", error)
        
        req.flash("notice", "An unexpected error occurred during registration.")
        return res.render("account/register", {
            title: "Register",
            nav,
            errors: [{ msg: error.message || "Registration failed. Please try again." }],
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

module.exports = accountController