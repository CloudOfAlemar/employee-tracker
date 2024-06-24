
/*
  Require Modules
*/
const { Pool } = require( "pg" );

/*
  Create pool instance
*/
const pool = new Pool( {
  user : "",
  password : "",
  host : "localhost",
  database : "employee_db"
} );

/*
  Export the pool instance
*/
module.exports = {
  pool
}