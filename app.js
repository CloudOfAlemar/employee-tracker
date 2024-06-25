
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
    1). Check the answers that are returned by the promptTask() function
    2). Run the corresponding function according to the value of the
        answers.task
    3). Call the recursiveTasksPrompt function within itself as long as
        the user doesn't select Quit
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
          console.table( departments );
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "View all Roles" ) {
        queryRoles()
        .then( roles => {
          console.table( roles );
          resolve( recursiveTasksPrompt() );
        } );
      } else if( answers.task === "View all Employees" ) {
        queryEmployeesSpecific()
        .then( employees => {
          console.table( employees );
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