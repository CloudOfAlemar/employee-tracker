
/*
  Require Modules
*/
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
  Add a Department
    1). Prompt for a new department
    2). Insert that new department into the database
*/
const addDepartment = () => {
  return promptNewDepartment()
  .then( answers => {
    return insertNewDepartment( answers.department );
  } );
}

/*
  Add Role
    1). Create the departmentInfo variable to hold the value
        coming back from the queryDepartments() function
    2). Create the departmentNames variable to hold the names of
        the departments. This array will be used in the promptNewRole
        function
    3). Capture the role, salary and department variables from the answers
        that are returned from the promptNewRole function
    4). Capture the id from the department
    5). Insert the new Role into the database
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
    1). Create the rolesInfo and managersInfo variables to hold
        the values of queryRoles and queryManagers
    2). Create roleNames and managerNames variables to pass into
        the promptNewEmployee function
    3). Capture the fname, lname, roleName, managerName from the answers
        that are returned from the promptNewEmployee function
    4). Find the manager_id and the role_id from the variables created
        in step 1).
    5). Insert the new Employee into the database
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

/*
  Update Employee Role
    1). Create the employeeInfo and rolesInfo variables to hold the values
        of the queryEmployee() and queryRoles() functions
    2). Create the employeeNames and roleTitles arrays to use in promptChangeRole()
        function
    3). Use the queryRoleId() to add a role_id property into answers
    4). Update the employee role in the database
*/
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

/*
  Export functions
*/
module.exports = {
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
}