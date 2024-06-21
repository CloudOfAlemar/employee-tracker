
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
  return inquirer
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
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit"
      ]
    }
  ] );
}

/*
  View all Departments
*/
const viewAllDepartments = () => {
  return new Promise( ( resolve, reject ) => {
    const queryString = `SELECT * FROM departments`;
    pool.query( queryString , ( error, { rows } ) => {
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
    const queryString =
    `SELECT r.title AS job_title, r.id AS role_id, d.name AS department_name, r.salary AS salary
    FROM roles r JOIN  departments d ON r.department = d.id`;
    pool.query(
      queryString,
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
  return inquirer
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
    return new Promise( ( resolve, reject ) => {
      pool.query( queryString, [ answers.department ], ( error, result ) => {
        if( error ) reject( error );
        console.log( `${ answers.department } department was created...` );
        resolve();
      } );
    } );
  } );
}

/*
  Add Role
*/
const fetchDepartments = () => {
  const queryString = `SELECT id, name FROM departments`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject();
      resolve( rows );
    } );
  } );
}

const addRole = () => {
  let departmentInfo;
  return fetchDepartments()
  .then( info => {
    departmentInfo = info;
    const departmentNames = departmentInfo.map( dep => dep.name );
    return inquirer
    .prompt( [
      {
        type : "input",
        message : "What is the name of the Role?",
        name : "role"
      },
      {
        type : "input",
        message : "What is the Salary of the Role?",
        name : "salary"
      },
      {
        type : "list",
        message : "Which Department does the Role belong to?",
        name : "department",
        choices : departmentNames
      }
    ] )
  } )
  .then( answers => {
    const { role, salary, department } = answers;
    const { id } = departmentInfo.find( dep => dep.name === department );
    const queryString = 
    `INSERT INTO roles( title, salary, department )
    VALUES ( $1, $2, $3 )`;
    return new Promise( ( resolve, reject ) => {
      pool.query( queryString, [ role, salary, id ], ( error, results ) => {
        if( error ) reject();
        console.log( "Role Created..." );
        resolve();
      } );
    } );
  } )
}

module.exports = {
  promptTasks,
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole
}