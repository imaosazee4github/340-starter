// const { Pool } = require("pg");
// require("dotenv").config();

// let pool;

// if (process.env.NODE_ENV === "development") {
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });

//   module.exports = {
//     query: async (text, params) => {
//       try {
//         const res = await pool.query(text, params);
//         console.log("executed query", { text });
//         return res;
//       } catch (error) {
//         console.error("Database error:", error);
//         throw error;
//       }
//     },
//   };
// } else {
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });

//   module.exports = pool;
// }

const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}