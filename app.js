
/*
  Require Modules
*/
const { promptTasks } = require( "./modules/inquirerPrompts" );

promptTasks()
.then( answers => {
  switch( answers.task ) {
    case "View all Departments" :
      return "VD";
    case "View all Roles" :
      return "VAR";
    case "View all Employees" :
      return "VAE";
    case "Add a Department" :
      return "AAD";
    case "Update an Employee Role" :
      return "UAER";
    case "Quit" :
      return "Quit";
  }
} )
.then( data => {
  console.log( data );
} );