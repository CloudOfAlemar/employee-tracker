
/*
  Require Modules
*/
const inquirer = require( "inquirer" );
const { pool } = require( "./connection" );

const {
  promptNewDepartment,
  promptNewRole,
  promptNewEmployee,
  promptChangeRole
} = require( "./inquirerPrompts" );

const {
  queryDepartments,
  queryRoles,
  queryManagers,
  queryEmployee,
  queryRoleId,
  insertNewDepartment,
  insertNewRole,
  insertNewEmployee,
  updateRole
} = require( "./queries" );

/*
  Connect to database
*/
pool.connect();

/*
  Add a Department
*/
const addDepartment = () => {
  return promptNewDepartment()
  .then( answers => {
    return insertNewDepartment( answers.department );
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
  return queryDepartments()
  .then( info => {
    departmentInfo = info;
    const departmentNames = departmentInfo.map( dep => dep.name );
    return promptNewRole( departmentNames );
  } )
  .then( answers => {
    const { role, salary, department } = answers;
    const { id } = departmentInfo.find( dep => dep.name === department );
    return insertNewRole( role, salary, id );
  } )
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
  return queryRoles()
  .then( info => {
    rolesInfo = info;
    return queryManagers();
  } )
  .then( info => {
    managersInfo = info;
    const roleNames = rolesInfo.map( role => role.title );
    const managerNames = managersInfo.map( manager => manager.manager_name );
    return promptNewEmployee( roleNames, managerNames )
    .then( answers => {
      const { fname, lname, roleName, managerName } = answers;
      const { id : manager_id } = managersInfo.find( manager => manager.manager_name === managerName );
      const { id : role_id } = rolesInfo.find( role => role.title === roleName );
      return insertNewEmployee( fname, lname, role_id, manager_id );
    } )
  } )
}

const updateEmployeeRole = () => {
  let employeeInfo;
  let rolesInfo;
  return queryEmployee()
  .then( info => {
    employeeInfo = info;
    return queryRoles();
  } )
  .then( info => {
    rolesInfo = info;
    const employeeNames = employeeInfo.map( empInfo => `${ empInfo.first_name } ${ empInfo.last_name }` );
    const roleTitles = rolesInfo.map( roleInfo => roleInfo.title );
    return promptChangeRole( employeeNames, roleTitles );
  } )
  .then( answers => {
    return queryRoleId( answers )
    .then( answers => {
      const { employee, roleId } = answers;
      const [ fname, lname ] = employee.split( " " );
      return updateRole( roleId, fname, lname );
    } );
  } )
}

module.exports = {
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
}