const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

//  Registration DATA validation rules

validate.registationRules = () => {
    return [
        // firstname
        body("account_firstname")
           .trim()
           .escape()
           .notEmpty()
           .withMessage("Please provide a first name."),

        //    Lastname
          body("account_lastname")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a last name."),

           // Email
           body("account_email")
           .trim()
           .escape()
           .notEmpty()
           .isEmail()
           .normalizeEmail()
           .withMessage("A valid email is required."),

           // Password
            body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }).withMessage("Password does not meet requirements."),

    ]
}

//Chack data and return errors
validate.checkRegData = async(req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()

        return res.render("account/register", {
            title: "Registration",
            nav,
            errors,
            account_firstname,
            account_lastname,
            account_email,  
        })
    }
    next()
}

// login data validatinrules
validate.loginRules = () => {
    return [
        // Email
        body("account_email")
           .trim()
           .escape()
           .notEmpty()
           .isEmail()
           .normalizeEmail()
           .withMessage("A valid email is required."),

        // Password
            body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Password is required."),
    ]
}

// check login data and return errors
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
         return res.render("account/login", {
            title: "Login",
            nav,
            errors: errors.array(),
            account_email,  
        })
    }
    next()
}

validate.updateAccountRules = () => {
    return [
        body("firstname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("First name is required"),
        
        body("lastname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Last name is required"),
        
        body("email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required")
    ]
}

validate.checkUpdateAccountData = async (req, res, next) => {
    const { firstname, lastname, email, account_id } = req.body
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        // Get current account data to repopulate form
        const accountData = await require('../models/account-model').getAccountById(account_id)
          return res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: errors.array(),
            messages: null,
            accountData: {
                account_id: account_id,
                account_firstname: firstname || accountData.account_firstname,
                account_lastname: lastname || accountData.account_lastname,
                account_email: email || accountData.account_email
            }
        })
    }
      const accountModel = require('../models/account-model')
    const existingAccount = await accountModel.getAccountByEmail(email)
    
    if (existingAccount && existingAccount.account_id != account_id) {
        let nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(account_id)
        
        return res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: [{ msg: "Email address is already registered to another account" }],
            messages: null,
            accountData: accountData
        })
    }
    
    next()
}

validate.changePasswordRules = () => {
    return [
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
        
        body("confirm_password")
            .trim()
            .notEmpty()
            .withMessage("Please confirm your password")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords do not match")
                }
                return true
            })
    ]
}

validate.checkChangePasswordData = async (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountModel = require('../models/account-model')
        const accountData = await accountModel.getAccountById(req.body.account_id)
        
        return res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: errors.array(),
            messages: null,
            accountData: accountData
        })
    }
    
    next()
}




module.exports = validate