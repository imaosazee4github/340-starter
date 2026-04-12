const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

// login user controller

async function buildLogin(req, res, next) {
    try {
        let nav = await utilities.getNav()

        res.render("account/login", {
            title: "Login",
            nav,
        })
    }catch(error) {
        next(error)
    }
}

// Register user controller
async function buildRegister(req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("account/register", {
            title: "Register",
            nav,
            errors: null
        })

    }catch(error){
        next(error)
    }
}

async function registerAccount(req, res, next){
    try{
        let nav = await utilities.getNav()

        const {
            account_firstname,
            account_lastname,
            account_email,
            account_password
        }= req.body

        let hashedPassword
        try{
             let hashedPassword = bcrypt.hashSync(hashedPassword, 10)
        }catch(error){
            req.flash("notice", "Sorry, there was an error processing the registeration.")
            return res.status(500).render("account/register", {
                title: "Registration",
                nav,
                errors: null
            })
        }
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        )

        if (regResult) {
            req.flash(
                "notice",
                `Congratulation, you're registered ${account_firstname}. Please log in.`
            )
            return res.status(201).render("account/login", {
                title: "Login",
                nav,
            })
        }else {
            req.flash("notice", "Sorry, the registeration failed.")
            return res.status(501).render("account/register", {
                title: "Register",
                nav,
                account_firstname,
                account_lastname,
                account_email,
            })
        }
    }catch(error){
        console.error("Register Error:", error)

        req.flash("notice", "An unexpected error occurred.")
        return res.status(500).render("account/register", {
            title: "Register",
            nav: await utilities.getNav(),
        })
    }
}

module.exports = {buildLogin, buildRegister, registerAccount}