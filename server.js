/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")

const app = express()

/* ***********************
 View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
     MIDDLEWARE
 *************************/
app.use(async(req, res,  next) => {
  try{
    res.locals.nav = await utilities.getNav()
  } catch(error){
    console.log("Nav error:", error)
    res.locals.nav = "<li><a href='/'>Home</a></li>"
  }
  next()
})



/* ***********************
 * Routes
 *************************/

app.use("/inv", inventoryRoute)
app.use(static)
app.get("/", baseController.buildHome)

/* ***********************
 * Error Handlers
 *************************/
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message)

  res.status(500).render("errors/error", {
    title: "Server Error",
    message: err.message
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000



/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${port}`)
})
