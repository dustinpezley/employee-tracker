//=====Dependencies=====//
const db = require('./db/connection');
const questions = require('./lib/questions');
const { showDepartments, addDepartment, deleteDepartment, showDepartmentEmployees, showDepartmentBudgets } = require('./lib/department');
const { showRoles, addRole, deleteRole } = require('./lib/role');
const { showEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEmployee } = require('./lib/employee');

db.connect(err => {
  if (err) throw err;
  // Log logo into terminal
  console.log("+-------------------------------------------------------+");
  console.log("|                                                       |");
  console.log("|     _____                 _                           |");
  console.log("|    |  ___|_ __ ___  _ __ | | ___  _   _  ___  ___     |");
  console.log("|    |  _| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\    |");
  console.log("|    | |___| | | | | | |_) | | (_) | |_| |  __/  __/    |");
  console.log("|    |_____|_| |_| |_| .__/|_|\\___/\\___, |\\___|\\___|    |");
  console.log("|                    |_|            |___/               |");
  console.log("|     __  __                                            |");
  console.log("|    |  \\/  | __ _ _ __   __ _  __ _  ___ _ __          |");
  console.log("|    | |\\/| |/ _` | '_ \\ / _` |/ _` |/ _ \\ '__|         |");
  console.log("|    | |  | | (_| | | | | (_| | (_| |  __/ |            |");
  console.log("|    |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|            |");
  console.log("|                               |__/                    |");
  console.log("|                                                       |");
  console.log("+-------------------------------------------------------+");

  // Confirm database connection
  console.log('Database connected.');

  //Call questions
  questions()
  .then(answers => {
    switch (answers.initialChoices) {
      case 'VIEW all departments':
        showDepartments();
        break;
      case 'VIEW all roles':
        showRoles();
        break;
      case 'VIEW all employess':
        showEmployees();
        break;
      case 'VIEW employees by department':
        showDepartmentEmployees();
        break;
      case 'VIEW department budgets':
        showDepartmentBudgets();
        break;
      case 'ADD a department':
        addDepartment(answers.department);
        break;
      case 'ADD a role':
        addRole(answers.roleName, answers.roleSalary);
        break;
      case 'ADD an employee':
        addEmployee(answers.employeeFirstName, answers.employeeLastName);
        break;
      case 'UPDATE an employee role':
        updateEmployeeRole();
        break;
      case "UPDATE an employee's manager":
        updateEmployeeManager();
        break;
      case 'DELETE a department':
        deleteDepartment();
        break;
      case 'DELETE a role':
        deleteRole();
        break;
      case 'DELETE an employee':
        deleteEmployee();
        break;
      case 'QUIT session':
        db.end();
        break;
      default: db.end();
    }
  });
});