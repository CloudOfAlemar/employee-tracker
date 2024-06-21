
/*
  Require Modules
*/
const { 
  promptTasks,
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole
} = require( "./modules/inquirerPrompts" );

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
        viewAllDepartments()
        .then( () => {
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "View all Roles" ) {
        viewAllRoles()
        .then( () => {
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "View all Employees" ) {
        viewAllEmployees()
        .then( () => {
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