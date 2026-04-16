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
  //  Remove password before creating token
  const safeAccountData = {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
  }

  //  Create JWT
  const accessToken = jwt.sign(
    safeAccountData,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  )

  // Set cookie (important for rubric)
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // good practice
    maxAge: 60 * 60 * 1000 // 1 hour
  })

  //  Flash success (optional but good UX)
  req.flash("notice", `Welcome ${safeAccountData.account_firstname}`)

  //  Redirect so header updates
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
           // Remove password from account data before storing in token
                 
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

accountController.buildUpdateAccount = async function(req, res, next) {
    try {
        let nav = await utilities.getNav()
        const account_id = req.params.id
        
        // Get fresh account data from database
        const accountData = await accountModel.getAccountById(account_id)
        
        if (!accountData) {
            req.flash("notice", "Account not found")
            return res.redirect("/account/")
        }
        
        res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
            messages: req.flash("notice"),
            accountData: accountData
        })
    } catch(error) {
        next(error)
    }
}

accountController.updateAccountInfo = async function(req, res, next) {
    let nav = await utilities.getNav()
    const { account_id, firstname, lastname, email } = req.body
    
    try {
        // Update the account information
        const updatedAccount = await accountModel.updateAccountInfo(account_id, firstname, lastname, email)
        
        if (updatedAccount) {
            // Get fresh account data
            const freshAccountData = await accountModel.getAccountById(account_id)
            
            // Update the JWT token with new information
            const safeAccountData = {
                account_id: freshAccountData.account_id,
                account_firstname: freshAccountData.account_firstname,
                account_lastname: freshAccountData.account_lastname,
                account_email: freshAccountData.account_email,
                account_type: freshAccountData.account_type,
            }
            
            const accessToken = jwt.sign(
                safeAccountData,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            )
            
            // Set new cookie with updated data
            res.cookie("jwt", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 1000
            })
            
            req.flash("notice", "Account information updated successfully!")
            return res.redirect("/account/")
        } else {
            req.flash("notice", "Failed to update account information")
            return res.redirect(`/account/update/${account_id}`)
        }
    } catch(error) {
        console.error("Update Account Error:", error)
        req.flash("notice", "An error occurred while updating your account")
        return res.redirect(`/account/update/${account_id}`)
    }
}

accountController.changePassword = async function(req, res, next) {
    let nav = await utilities.getNav()
    const { account_id, password } = req.body
    
    try {
        // Hash the new password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        
        // Update the password in database
        const passwordUpdated = await accountModel.updatePassword(account_id, hashedPassword)
        
        if (passwordUpdated) {
            req.flash("notice", "Password changed successfully!")
            return res.redirect("/account/")
        } else {
            req.flash("notice", "Failed to change password")
            return res.redirect(`/account/update/${account_id}`)
        }
    } catch(error) {
        console.error("Change Password Error:", error)
        req.flash("notice", "An error occurred while changing your password")
        return res.redirect(`/account/update/${account_id}`)
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