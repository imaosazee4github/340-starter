/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
require("dotenv").config()
const expressLayouts = require("express-ejs-layouts")
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")
const session = require("express-session")
const pool = require('./database/index')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")



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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(async(req, res,  next) => {
  try{
    res.locals.nav = await utilities.getNav()
  } catch(error){
    console.log("Nav error:", error)
    res.locals.nav = "<li><a href='/'>Home</a></li>"
  }
  next()
})

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(require('connect-flash')())

app.use(function(req, res, next){
  res.locals.messages = require("express-messages")(req, res)
  next()
})

app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/

app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use(static)
app.get("/", baseController.buildHome)

/* ***********************
 * Error Handlers
 *************************/
app.use((req, res, next) => {
  res.status(404).render("errors/error", {
    title: "404 Not Found",
    message: "Sorry, the requested page was not found."
  })
})
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
const port = process.env.PORT || 5500



/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${port}`)
})
