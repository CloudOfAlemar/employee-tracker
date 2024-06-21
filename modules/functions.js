
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
    1). prompt a user for a task
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
    1). pool.query makes a query to the database and gets
        info
    2). promise is returned
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
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject( error );
      console.log( rows );
      resolve();
    } );
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
    1). Inquirer prompts for a department name
    2). A query is made to the database and returns
        the results
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
  Fetch Departments
    1). will retrieve the id and name property and values
        from departements
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

/*
  Add Role
    1). capture the department info so it can be used
        in the next .then() block
    2). Create an array that holds all department names
        and pass them into the inquire prompt as choices
        for the user to select from
    3). destructure the role, salary and department variables
        from the inquirer answers
    4). get the id of the selected department 
    5). create a role by passing the role, salary and id variables
*/
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
        console.log( `${ role } Role Created...` );
        resolve();
      } );
    } );
  } )
}

/*
  Fetch all roles
*/
const fetchRoles = () => {
  const queryString = `SELECT id, title FROM roles`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject( error );
      resolve( rows );
    } );
  } );
}

/*
  Fetch all employees that can be managers
*/
const fetchManagers = () => {
  const queryString =
  `SELECT id, CONCAT( first_name, ' ', last_name ) AS manager_name
  FROM employees`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject( error );
      resolve( rows );
    } );
  } );
}

/*
  Add Employee
    1). use fetchRoles and fetchManagers to assign the rolesInfo
        and managersInfo variables
    2). Create employee based on user response to prompts
*/
const addEmployee = () => {
  let rolesInfo;
  let managersInfo;
  return fetchRoles()
  .then( info => {
    rolesInfo = info;
    return fetchManagers();
  } )
  .then( info => {
    managersInfo = info;
    const roleNames = rolesInfo.map( role => role.title );
    const managerNames = managersInfo.map( manager => manager.manager_name );
    return inquirer
    .prompt( [
      {
        type : "input",
        message : "What is the employee's first name?",
        name : "fname"
      },
      {
        type : "input",
        message : "What is the employee's last name?",
        name : "lname"
      },
      {
        type : "list",
        message : "What is the employee's role?",
        name : "roleName",
        choices : roleNames
      },
      {
        type : "list",
        message : "Who is the employee's manager?",
        name : "managerName",
        choices : managerNames
      }
    ] )
    .then( answers => {
      const { fname, lname, roleName, managerName } = answers;
      const { id : manager_id } = managersInfo.find( manager => manager.manager_name === managerName );
      const { id : role_id } = rolesInfo.find( role => role.title === roleName );
      const queryString =
      `INSERT INTO employees( first_name, last_name, role_id, manager_id )
      VALUES ( $1, $2, $3, $4 )`;
      return new Promise( ( resolve, reject ) => {
        pool.query( queryString, [ fname, lname, role_id, manager_id ], ( error, results ) => {
          if( error ) reject( error );
          console.log( `New employee added: ${ fname } ${ lname }` );
          resolve();
        } );
      } );
    } )
  } )
}

module.exports = {
  promptTasks,
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee
}