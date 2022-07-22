const inquirer = require('inquirer');


const prompts = () => {
  inquirer.prompt ([
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
        'DELETE an employee'
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
        if(initialChoices.answer !== 'ADD a department') {
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
        if(initialChoices.answer !== 'ADD a role') {
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
        } else if(roleNameInput.length >6) {
          console.warn('The salary must be no more than 6 figures.');
          return false;
        } else {
          return true;
        }
      },
      when: ({initialChoices}) => {
        if(initialChoices.answer !== 'ADD a role') {
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
        if(initialChoices.answer !== 'ADD an employee') {
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
        if(initialChoices.answer !== 'ADD an employee') {
          return false;
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'employeeManagerName',
      message: "What is the name of the employee's manager?",
      validate: (employeeManagerNameInput) => {
        if(!employeeManagerNameInput) {
          console.warn("Please enter the manager's name.");
          return false;
        }
        return true;
      },
      when: ({initialChoices}) => {
        if(initialChoices.answer !== 'ADD an employee') {
          return false;
        }
        return true;
      }
    }
  ])
}

module.exports = prompts;