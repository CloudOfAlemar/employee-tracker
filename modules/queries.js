
const { pool } = require( "./connection" );

/*
  Query Departments
*/
const queryDepartments = () => {
  const queryString = `SELECT * FROM departments`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString , ( error, { rows } ) => {
      if( error ) reject( error );
      resolve( rows );
    } );
  } );
}

/*
  Query Roles
*/
const queryRoles = () => {
  const queryString = 
  `SELECT r.id, r.title, d.name AS department, r.salary 
  FROM roles r JOIN departments d 
  ON r.department = d.id`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject( error );
      resolve( rows );
    } );
  } );
}

/*
  Query Employees
*/
const queryEmployeesSpecific = () => {
  return new Promise( ( resolve, reject ) => {
    const queryString =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT( m.first_name, ' ', m.last_name ) AS manager
    FROM employees e 
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department = d.id
    LEFT JOIN employees m ON e.manager_id = m.id`;
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject( error );
      resolve( rows );
    } );
  } );
}

/*
  Fetch all employees that can be managers
*/
const queryManagers = () => {
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
  Query Employee
*/
const queryEmployee = () => {
  const queryString = `SELECT * FROM employees`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString, ( error, { rows } ) => {
      if( error ) reject( error );
      resolve( rows );
    } );
  } );
}

/*
  Query Role Id
*/
const queryRoleId = answers => {
  return new Promise( ( resolve, reject ) => {
    const queryString = `SELECT id FROM roles WHERE roles.title = $1`;
    pool.query( queryString, [ answers.role ], ( error, { rows } ) => {
      if( error ) reject( error );
      answers.roleId = rows[ 0 ].id;
      resolve( answers );
    } );
  } )
}

/*
  Insert New Department
*/
const insertNewDepartment = deptartmentName => {
  const queryString =
  `INSERT INTO departments( name ) VALUES ( $1 )`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString, [ deptartmentName ], ( error, result ) => {
      if( error ) reject( error );
      console.log( `${ deptartmentName } department was created...` );
      resolve();
    } );
  } );
}

/*
  Insert New Role
*/
const insertNewRole = ( role, salary, id ) => {
  const queryString = 
  `INSERT INTO roles( title, salary, department )
  VALUES ( $1, $2, $3 )`;
  return new Promise( ( resolve, reject ) => {
    pool.query( queryString, [ role, salary, id ], ( error, results ) => {
      if( error ) reject( error );
      console.log( `${ role } Role Created...` );
      resolve();
    } );
  } );
}

/*
  Insert New Employee
*/

const insertNewEmployee = ( fname, lname, role_id, manager_id ) => {
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
}

/*
  Update Employee Role
  Change name
*/
const updateRole = ( roleId, fname, lname ) => {
  return new Promise( ( resolve, reject ) => {
    const queryString = 
    `UPDATE employees SET role_id = $1 
    WHERE first_name = $2 AND last_name = $3`;
    pool.query( queryString, [ roleId, fname, lname ], ( error, results ) => {
      if( error ) reject();
      console.log( `Updated ${ fname } ${ lname }'s role...` );
      resolve();
    } );
  } );
}

module.exports = {
  queryDepartments,
  queryRoles,
  queryEmployeesSpecific,
  queryManagers,
  queryEmployee,
  queryRoleId,
  insertNewDepartment,
  insertNewRole,
  insertNewEmployee,
  updateRole
}