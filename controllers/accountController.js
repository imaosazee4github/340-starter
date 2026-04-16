const jwt = require("jsonwebtoken")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
require("dotenv").config()


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

accountController.accountLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    
    try {
        const accountData = await accountModel.getAccountByEmail(account_email)

            if (!accountData) {
            req.flash("notice", "Please check your credentials and try again.")
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: [{ msg: "Invalid email or password" }],
                account_email,
            })
        }

         const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
        
        if (passwordMatch) {
            // Remove password from account data before storing in token
            const safeAccountData = { ...accountData }
            delete safeAccountData.account_password
            
            // Create JWT token
            const accessToken = jwt.sign(
                safeAccountData,
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: "1h" } 
            )
                res.cookie("jwt", accessToken, { 
                    httpOnly: true, 
                    maxAge: 3600 * 1000 
                })

                return res.redirect("/account/")
            }
              req.flash("notice", "Invalid email or password")
              return res.status(400).render("account/login", {
              title: "Login",
              nav,
              errors: [{ msg: "Invalid email or password" }],
              account_email,
        })
   } catch (error) {
        console.error("Login Error:", error)
        next(error)
    }
}
              
                 
accountController.buildAccountManagement = async function(req, res, next) {
    try {
        let nav = await utilities.getNav()

        res.render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            messages: req.flash("notice"),
            accountData: res.locals.accountData,
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
        } 

            req.flash("notice", "Sorry, the registration failed. Please try again.")
            return res.render("account/register", {
                title: "Register",
                nav,
                errors: [{ msg: "Registration failed. Please try again." }],
                account_firstname,
                account_lastname,
                account_email
            })

    } catch(error) {
        console.error("Register Error:", error)
        
        req.flash("notice", "An unexpected error occurred during registration.")
        return res.render("account/register", {
            title: "Register",
            nav,
            errors: [{ msg: error.message || "Registration failed. Please try again." }],
            account_firstname,
            account_lastname,
            account_email,
        })
    }
}

module.exports = accountController