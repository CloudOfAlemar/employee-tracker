
const inquirer = require( "inquirer" );

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

module.exports = {
  promptTasks
}