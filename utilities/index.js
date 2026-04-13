const invModel = require("../models/inventory-model")
const Util = {}

Util.getNav = async function () {
    try {
        let data = await invModel.getClassifications()
        let list = ""

        // let list = "<ul>"
        list += '<li><a href="/">Home</a></li>'

        if (data && data.length > 0) {
            data.forEach(row => {
                list += `<li>
                    <a href="/inv/type/${row.classification_id}">
                        ${row.classification_name}
                    </a>
                </li>`
            })
        }

        return list

    } catch (error) {
        console.log("Nav error:", error)
        return '<li><a href="/">Home</a></li>'
    }
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications()
    let list = '<select name="classification_id" id="classificationList" required>'
    list += "<option value=''>Choose a Classification</option>"

    // Check if data is an array (success case) or has rows property (error case)
    let classifications = Array.isArray(data) ? data : (data.rows || [])
    
    if (classifications.length > 0) {
      classifications.forEach(row => {
        list += `<option value="${row.classification_id}"`
        
        if (classification_id == row.classification_id) {
          list += " selected"
        }

        list += `>${row.classification_name}</option>`
      })
    } else {
      list += "<option value=''>No classifications available</option>"
    }

    list += "</select>"
    return list
  } catch (error) {
    console.error("Error building classification list:", error)
    return '<select name="classification_id" required><option value="">Error loading classifications</option></select>'
  }
}


Util.buildClassificationGrid = async function(data){
  let grid=""

  if(data && data.length > 0){
    grid = '<ul id="inv-display">'

    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  `<a href="/inv/detail/'${vehicle.inv_id}"
                title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`
      grid += `<img src=" ${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />`
      grid += `</a>`

      grid += '<div class="namePrice">'
      grid += '<hr />'

      grid += `<h2>
                   <a href="/inv/detail/${vehicle.inv_id}" 
                   title="View ${vehicle.inv_make} ${vehicle.inv_model} details"> 
                   ${vehicle.inv_make} ${vehicle.inv_model}
                 </a>
                 </h2>`

      
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
      grid += '</div>'
      grid += '</li>'
    })
    
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleDetail = async function(vehicle) {
  const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles)
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(vehicle.inv_price)


  let detail = `
   <div class="vehicle-detail">

    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" 
           alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>

    <div class="vehicle-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

      <p><strong>Price:</strong> ${price}</p>

      <p><strong>Mileage:</strong> ${miles} miles</p>

      <p><strong>Color:</strong> ${vehicle.inv_color}</p>

      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
    </div>

  </div>
  `
  return detail
}

Util.handleErrors = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util