const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
inquirer.registerPrompt('automcomplete', require('inquirer-autocomplete-prompt'));

// Define each method as a function to use in app file.
// Show all employees
showEmployees = () => {
  console.alert('Showing all employees...\n');
  const sql =`SELECT * FROM employee`;

  db.promise().query(sql, (err, rows) => {
    if(err) {
      console.warn(err);
    }
    console.table(rows);
  });
};

// Add employee
addEmployee = (firstName, lastName) => {
  const params = [firstName, lastName];

  const currentRoleSql = `SELECT title, id FROM role`;
  db.promise().query(currentRoleSql, (err, rows) => {
    if(err) {
      console.warn(err);
    }
    const role = rows.map(({ id, name }) => ({ key: id, value: name }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeRole',
        message: 'Which role will this employee occupy?',
        choices: role
      }
    ])
      .then(employeeRoleChoice => {
        const employeeRole = Object.keys(employeeRoleChoice);
        params.push(employeeRole);
      });
  });

  const currentManagerSql = `SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee`;
  db.promise().query(currentManagerSql, (err, rows) => {
    if(err) {
      console.warn(err);
    }
    const manager = rows.map(({ id, employeeName }) => ({ key: id, value: employeeName }));

    inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'employeeManager',
        message: 'To whom will this employee report?',
        source: manager
      }
    ])
      .then(employeeManagerChoice => {
        const employeeManager = Object.keys(employeeManagerChoice);
        params.push(employeeManager);
      });
  });

  console.log(params);
  const sql = `INSERT INTO employee (first_name, last_name, role, manager_id) VALUES (?,?,?,?)`;
  db.promise().query(sql, params, (err,result) => {
    if(err) {
      console.warn(err);
    }
    console.alert(`Successfully added ${firstName} ${lastName} to employees.`);
  });
};

//Update employee role
updateEmployeeRole = () => {
  const currentEmployeeSql = `SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee`;
  const params = [];

  // determine employee to update
  db.promise().query(currentEmployeeSql, (err, rows) => {
    if(err) {
      console.warn(err);
    }

    const employees = rows.map(({ id, employeeName }) => ({ key: id, value: employeeName }));
    inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'employeeUpdate',
        message: 'Which employee would you like to update?',
        source: employees
      }
    ])
      .then(employeeUpdateChoice => {
        const employeeUpdate = Object.keys(employeeUpdateChoice);
        params.push(employeeUpdate);
      });
    })
  // determine the role to use in the update    
  currentRoleSql = `SELECT id, title FROM role`;

  db.promise().query(currentRoleSql, (err, rows) => {
    if(err) {
      console.warn(err);
    }
    const roles = rows.map(({ id, role }) => ({ key: id, value: role }));
    inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'employeeRoleUpdate',
        message: 'To which role would you like to assign the employee?',
        source: roles
      }
    ])
    .then(employeeRoleUpdateChoice => {
      const employeeRoleUpdate = Object.keys(employeeRoleUpdateChoice);
      params.unshift(employeeRoleUpdate);
    });
  })

  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  db.promise().query(sql, params, (err, result) => {
    if(err) {
      console.warn(err);
    }
    console.alert('Update successful.')
    const updateSql= `SELECT * FROM employee WHERE id = ?`

    db.promise().query(updateSql, params[1], (err, result) => {
      console.table(result);
    });
  });
};

//updateEmployeeManager
updateEmployeeManager = () => {
  const currentEmployeeSql = `SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee`;
  const params = [];

  // determine employee to update
  db.promise().query(currentEmployeeSql, (err, rows) => {
    if(err) {
      console.warn(err);
    }

    const employees = rows.map(({ id, employeeName }) => ({ key: id, value: employeeName }));
    inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'employeeUpdate',
        message: 'Which employee would you like to update?',
        source: employees
      },
      {
        type: 'autocomplete',
        name: 'employeeManager',
        message: 'To whom will this employee report?',
        source: employees
      }
    ])
      .then((employeeUpdateChoice, employeeManagerChoice) => {
        const employeeUpdate = Object.keys(employeeUpdateChoice);
        const employeeManager = Object.keys(employeeManagerChoice);
        params.push(employeeManager, employeeUpdate);
      });
    })
  
  // Run update
  const sql = `UPDATE employee SET manager_id = ?  WHERE id = ?`;
  db.promise().query(sql, params, (err, result) => {
    if(err) {
      console.warn(err);
    }
    console.alert('Update successful.')
    const updateSql= `SELECT * FROM employee WHERE id = ?`

    db.promise().query(updateSql, params[1], (err, result) => {
      console.table(result);
    });
  });
}

// Delete employee
deleteEmployee = () => {
  const currentEmployeeSql = `SELECT id, CONCAT(first_name, " ", lastname) AS employee_name FROM employee`;

  db.promise().query(currentEmployeeSql, (err, rows) => {
    if(err) {
      console.warn(err);
    }
    const employees = rows.map(({ id, employeeName }) => ({ key: id, value: employeeName }));

    inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'employeeDelete',
        message: 'Which employee would you like to delete?',
        source: employees
      }
    ])
      .then(employeeDeleteChoice => {
        const sql = `DELETE FROM employee WHERE id = ?`;
        const params = Object.keys(employeeDeleteChoice);

        db.promise().query(sql, params, (err, result) => {
          if(err) {
            console.warn(err);
          }

          console.alert('Delete successful');

          showEmployees();
        });
      });
  });
};

module.exports = { showEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEmployee }