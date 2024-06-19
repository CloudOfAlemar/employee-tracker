
/*
  Require Modules
*/
const inquirer = require( "inquirer" );
const { Pool } = require( "pg" );

/*
  Connect to Database
*/
const pool = new Pool( {
  user : "",
  password : "",
  host : "localhost",
  database : "employee_db"
} );

pool.connect();

/*
  Prompt for a Task
*/
const promptTasks = function() {
  return new Promise( ( resolve, reject ) => {
    inquirer
    .prompt( [
      {
        type : "list",
        message : "What would you like to do?",
        name : "task",
        choices : [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add an Employee",
          "Update an Employee Role",
          "Quit"
        ]
      }
    ] )
    .then( answers => {
      resolve( answers );
    } )
    .catch( error => {
      reject( error );
    } );
  } );
}

/*
  View all Departments
*/
const viewAllDepartments = () => {
  return new Promise( ( resolve, reject ) => {
    pool.query( 'SELECT * FROM departments', ( error, { rows } ) => {
      if( error ) reject( error );
      resolve( rows );
    } );
  } );
}

module.exports = {
  promptTasks,
  viewAllDepartments
}