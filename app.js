
/*
  Require Modules
*/
const { promptTasks, viewAllDepartments } = require( "./modules/inquirerPrompts" );

const recursiveTasksPrompt = () => {
  return new Promise( ( resolve, reject ) => {
    promptTasks()
    .then( answers => {
      if( answers.task === "Quit" ) {
        console.log( "Process finished..." );
        resolve();
      } else if( answers.task === "View all Departments" ) {
        viewAllDepartments()
        .then( rows => {
          console.log( rows );
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