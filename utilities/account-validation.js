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

module.exports = validate