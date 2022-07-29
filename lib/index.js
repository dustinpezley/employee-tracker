const inquirer = require('inquirer');
const { showDepartments, addDepartment, deleteDepartment, showDepartmentEmployees, showDepartmentBudgets } = require('./department');
const { showRoles, addRole, deleteRole } = require('./role');
const { showEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEmployee } = require('./employee');
const db = require('../db/connection');


function terminalInterface() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'initialChoices',
      message: 'What would you like to do?',
      choices: [
        'VIEW all departments',
        'VIEW all roles',
        'VIEW all employees',
        'VIEW employees by department',
        'VIEW department budgets',
        new inquirer.Separator(),
        'ADD a department',
        'ADD a role',
        'ADD an employee',
        new inquirer.Separator(),
        'UPDATE an employee role',
        "UPDATE an employee's manager",
        new inquirer.Separator(),
        'DELETE a department',
        'DELETE a role',
        'DELETE an employee',
        new inquirer.Separator(),
        'QUIT session'
      ],
    },
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department you would like to add?',
      validate: (departmentInput) => {
        if(!departmentInput) {
          console.warn('Please enter a department name.');
          return false;
        } else if(departmentInput.length >30) {
          console.warn('The department name must be no longer than 30 characters.');
          return false;
        } else {
          return true;
        }
      },
      when: ({initialChoices}) => {
        if(initialChoices !== 'ADD a department') {
          return false;
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'roleName',
      message: 'What is the name of the role you would like to add?',
      validate: (roleNameInput) => {
        if(!roleNameInput) {
          console.warn('Please enter a role name.');
          return false;
        } else if(roleNameInput.length >30) {
          console.warn('The role name must be no longer than 30 characters.');
          return false;
        } else {
          return true;
        }
      },
      when: ({initialChoices}) => {
        if(initialChoices !== 'ADD a role') {
          return false;
        }
        return true;
      }
    },
    {
      type: 'number',
      name: 'roleSalary',
      message: 'What is the salary for this position?',
      validate: (roleSalaryInput) => {
        if(!roleSalaryInput) {
          console.warn('Please enter a salary.');
          return false;
        } else if(roleSalaryInput.length >6) {
          console.warn('The salary must be no more than 6 figures.');
          return false;
        } else {
          return true;
        }
      },
      when: ({initialChoices}) => {
        if(initialChoices !== 'ADD a role') {
          return false;
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'employeeFirstName',
      message: 'What is the first name of the employee you would like to add?',
      validate: (employeeFirstNameInput) => {
        if(!employeeFirstNameInput) {
          console.warn("Please enter the employee's first name.");
          return false;
        } else if(employeeFirstNameInput.length >30) {
          console.warn("The employee's first name must be no longer than 30 characters.");
          return false;
        } else {
          return true;
        }
      },
      when: ({initialChoices}) => {
        if(initialChoices !== 'ADD an employee') {
          return false;
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'employeeLastName',
      message: 'What is the last name of the employee you would like to add?',
      validate: (employeeLastNameInput) => {
        if(!employeeLastNameInput) {
          console.warn("Please enter the employee's last name.");
          return false;
        } else if(employeeLastNameInput.length >30) {
          console.warn("The employee's last name must be no longer than 30 characters.");
          return false;
        } else {
          return true;
        }
      },
      when: ({initialChoices}) => {
        if(initialChoices !== 'ADD an employee') {
          return false;
        }
        return true;
      }
    }
  ])
  .then(answers => {
    switch (answers.initialChoices) {
      case 'VIEW all departments':
        showDepartments();
        // terminalInterface();
        break;
      case 'VIEW all roles':
        showRoles();
        // terminalInterface();
        break;
      case 'VIEW all employees':
        showEmployees();
        // terminalInterface();
        break;
      case 'VIEW employees by department':
        showDepartmentEmployees();
        // terminalInterface();
        break;
      case 'VIEW department budgets':
        showDepartmentBudgets();
        // terminalInterface();
        break;
      case 'ADD a department':
        addDepartment(answers.department);
        // terminalInterface();
        break;
      case 'ADD a role':
        addRole(answers.roleName, answers.roleSalary);
        // terminalInterface();
        break;
      case 'ADD an employee':
        addEmployee(answers.employeeFirstName, answers.employeeLastName);
        // terminalInterface();
        break;
      case 'UPDATE an employee role':
        updateEmployeeRole();
        // terminalInterface();
        break;
      case "UPDATE an employee's manager":
        updateEmployeeManager();
        // terminalInterface();
        break;
      case 'DELETE a department':
        deleteDepartment();
        // terminalInterface();
        break;
      case 'DELETE a role':
        deleteRole();
        // terminalInterface();
        break;
      case 'DELETE an employee':
        deleteEmployee();
        // terminalInterface();
        break;
      case 'QUIT session':
        db.end();
        break;
      default: db.end();
    }
    // terminalInterface();
    setTimeout(() => {
      terminalInterface();
    }, 2000)
  });
};

module.exports = terminalInterface;