
/*
  Require Modules
*/
const { promptTasks, viewAllDepartments, viewAllRoles, viewAllEmployees } = require( "./modules/inquirerPrompts" );

const recursiveTasksPrompt = () => {
  return new Promise( ( resolve, reject ) => {
    promptTasks()
    .then( answers => {
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
      }
    });
  } );
}

recursiveTasksPrompt()
.then( () => {
  process.exit();
} );