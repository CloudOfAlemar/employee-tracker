
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
      console.log( rows );
      resolve();
    } );
  } );
}

/*
  View all Roles
*/
const viewAllRoles = () => {
  return new Promise( ( resolve, reject ) => {
    pool.query(
      'SELECT roles.title AS job_title, roles.id AS role_id, departments.name AS department_name, roles.salary AS salary  FROM roles JOIN  departments ON roles.department = departments.id',
      ( error, { rows } ) => {
        if( error ) reject( error );
        console.log( rows );
        resolve();
      }
    );
  } );
}

/*
  View all Employees
*/
const viewAllEmployees = () => {
  return new Promise( ( resolve, reject ) => {
    const queryString =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT( m.first_name, ' ', m.last_name ) AS manager
    FROM employees e JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department = d.id
    LEFT JOIN employees m ON e.manager_id = m.id`;
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject( error );
      console.log( rows );
      resolve( rows );
    } );
  } );
}

/*
  Add a Department
*/
const addDepartment = () => {
  return new Promise( ( resolve, reject ) => {
    inquirer
    .prompt( [
      {
        type : "input",
        message : "What is the name of the department?",
        name : "department"
      }
    ] )
    .then( answers => {
      const queryString =
      `INSERT INTO departments( name ) VALUES ( $1 )`;
      pool.query( queryString, [ answers.department ], ( error, result ) => {
        if( error ) reject( error );
        console.log( `${ answers.department } department was created...` );
        resolve();
      } );
    } )
  } );
}

module.exports = {
  promptTasks,
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment
}