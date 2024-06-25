
/*
  Require Modules
*/
const {
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
} = require( "./modules/functions" );

const { promptTasks } = require( "./modules/inquirerPrompts" );

const {
  queryDepartments,
  queryRoles,
  queryEmployeesSpecific
} = require( "./modules/queries" );

/*
  Recursive Tasks Prompt
    1). prompt for a task recursively if the user input choice
        is not Quit
    2). check answers.task and run corresponding function
*/
const recursiveTasksPrompt = () => {
  return promptTasks()
  .then( answers => {
    return new Promise( ( resolve, reject ) => {
      if( answers.task === "Quit" ) {
        console.log( "Process finished..." );
        resolve();
      } else if( answers.task === "View all Departments" ) {
        queryDepartments()
        .then( departments => {
          console.log( departments );
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "View all Roles" ) {
        queryRoles()
        .then( roles => {
          console.log( roles );
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "View all Employees" ) {
        queryEmployeesSpecific()
        .then( employees => {
          console.log( employees );
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "Add a Department" ) {
        addDepartment()
        .then( () => {
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "Add a Role" ) {
        addRole()
        .then( () => {
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "Add an Employee" ) {
        addEmployee()
        .then( () => {
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "Update an Employee Role" ) {
        updateEmployeeRole()
        .then( () => {
          resolve( recursiveTasksPrompt() );
        } );
      }
    } );
  });
}

/*
  End Process when user selects Quit
*/
recursiveTasksPrompt()
.then( () => {
  process.exit();
} );