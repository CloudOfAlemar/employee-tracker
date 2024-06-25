
const inquirer = require( "inquirer" );

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
  Prompt New Department
*/
const promptNewDepartment = () => {
  return inquirer
  .prompt( [
    {
      type : "input",
      message : "What is the name of the department?",
      name : "department"
    }
  ] )
}

/*
  Prompt New Role
*/
const promptNewRole = departmentNames => {
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
}

/*
  Prompt New Employee
*/
const promptNewEmployee = ( roleNames, managerNames ) => {
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
}

/*
  Prompt Change Role
*/
const promptChangeRole = ( employeeNames, roleTitles ) => {
  return inquirer
  .prompt( [
    {
      type : "list",
      message : "Which employee's role would you like to Update?",
      name : "employee",
      choices : employeeNames
    },
    {
      type : "list",
      message : "Which role do you want to assign the selected employee?",
      name : "role",
      choices : roleTitles
    }
  ] );
}

/*
  Export Functions
*/
module.exports = {
  promptTasks,
  promptNewDepartment,
  promptNewRole,
  promptNewEmployee,
  promptChangeRole
}