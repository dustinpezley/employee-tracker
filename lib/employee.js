const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Define each method as a function to use in app file.
// Show all employees
function showEmployees() {
  const sql =`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, CONCAT('$', FORMAT(role.salary, 0)) AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = employee.manager_id`;

  db.query(sql, (err, rows) => {
    if(err) {
      console.log(err);
    }
    console.log('\n');
    console.log('Showing all employees...\n');
    console.table(rows);
  });
};

// Add employee
function addEmployee(firstName, lastName) {
  const params = [firstName, lastName];

  const currentRoleSql = `SELECT employee.id, CONCAT(employee.last_name, ', ', employee.first_name) AS employee_name, role.title AS title, role.id AS role_id, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id`;
  db.query(currentRoleSql, async (err, rows) => {
    if(err) {
      console.log(err);
    }

    const role = Array.from(new Set(rows.map(table => table.role_id)))
      .map(role_id => {
        return {
          name: rows.find(table => table.role_id === role_id).title,
          value: role_id
        }
      }); 

    const manager = rows.map(({ id, employee_name }) => ({ name:employee_name, value: id }));
      console.log(manager);
    await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeRole',
        message: 'Which role will this employee occupy?',
        pageSize: 10,
        choices: role
      },
      {
        type: 'list',
        name: 'employeeManager',
        message: 'To whom will this employee report?',
        emptyText: 'No results...',
        pageSize: 10,
        choices: manager.sort((a,b) => (a.name > b.name) ? 1: -1),
      }
    ])
    .then(answers => {
      const employeeRole = answers.employeeRole;
      const employeeManager = answers.employeeManager;
      params.push(employeeRole, employeeManager);
    });
     
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    db.query(sql, params, (err,result) => {
      if(err) {
        console.log(err);
      } else {
        console.log('\n');
        console.log(`Successfully added ${firstName} ${lastName} to employees.`);
      }
    });
  });
};

//Update employee role
function updateEmployeeRole() {
  const currentEmployeeSql = `SELECT employee.id, CONCAT(employee.last_name, ', ', employee.first_name) AS employee_name, role.title AS title, role.id AS role_id, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id`;
  const params = [];

  // determine employee to update
  db.query(currentEmployeeSql, async (err, rows) => {
    if(err) {
      console.log(err);
    }

    const role = Array.from(new Set(rows.map(table => table.role_id)))
    .map(role_id => {
      return {
        name: rows.find(table => table.role_id === role_id).title,
        value: role_id
      }
    });
    
    // const roleArray = [];
    // roleArray.push(role);
    // console.log(rows);
    // const role = new Set();
    // role.add(rows.title);

    console.log(role);

    const employees = rows.map(({ id, employee_name }) => ({ name: employee_name, value: id }));
    await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeUpdate',
        message: 'Which employee would you like to update?',
        choices: employees.sort((a,b) => (a.name > b.name) ? 1: -1)
      },
      {
        type: 'list',
        name: 'employeeRoleUpdate',
        message: 'To which role would you like to assign the employee?',
        choices: role
      }
    ])
    .then(answers => {
      const employeeUpdate = answers.employeeUpdate;
      const employeeRoleUpdate = answers.employeeRoleUpdate;
      params.push(employeeRoleUpdate, employeeUpdate);
    });

    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    db.query(sql, params, (err, result) => {
      if(err) {
        console.log(err);
      }
      console.log('\n');
      console.log('Update successful.');
      console.log('\n');
      const updateSql= `SELECT employee.id, CONCAT(employee.last_name, ', ', employee.first_name) AS employee_name, role.title AS title, role.id AS role_id, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE employee.id = ?`
  
      db.query(updateSql, params[1], (err, result) => {
        console.table(result);
      });
    });
  });
};

//updateEmployeeManager
function updateEmployeeManager() {
  const currentEmployeeSql = `SELECT id, CONCAT(last_name, ', ',first_name) AS employee_name FROM employee`;
  const params = [];

  // determine employee to update
  db.query(currentEmployeeSql, async (err, rows) => {
    if(err) {
      console.log(err);
    }

    const employees = rows.map(({ id, employee_name }) => ({ name: employee_name, value: id }));
    await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeUpdate',
        message: 'Which employee would you like to update?',
        choices: employees.sort((a,b) => (a.name > b.name) ? 1: -1)
      },
      {
        type: 'list',
        name: 'employeeManager',
        message: 'To whom will this employee now report?',
        choices: employees.sort((a,b) => (a.name > b.name) ? 1: -1)
      }
    ])
    .then(answers => {
      const employeeUpdate = answers.employeeUpdate;
      const employeeManager = answers.employeeManager;
      params.push(employeeManager, employeeUpdate);
    });

    // Run update
    const sql = `UPDATE employee SET manager_id = ?  WHERE id = ?`;
    db.query(sql, params, (err, result) => {
      if(err) {
        console.log(err);
      }
      console.log('\n');
      console.log('Update successful.');
      console.log('\n');
      const updateSql= `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name, role.title AS role, CONCAT(m.first_name, ' ', m.last_name) AS manager, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = employee.manager_id WHERE employee.id = ?`;

      db.query(updateSql, params[1], (err, result) => {
        console.table(result);
      });
    });
  })
}

// Delete employee
function deleteEmployee() {
  const currentEmployeeSql = `SELECT id, CONCAT(last_name, ', ', first_name) AS employee_name FROM employee`;

  db.query(currentEmployeeSql, async (err, rows) => {
    if(err) {
      console.log(err);
    }
    const employees = rows.map(({ id, employee_name }) => ({ name: employee_name, value: id }));

    await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeDelete',
        pageSize: 20,
        message: 'Which employee would you like to delete?',
        choices: employees.sort((a,b) => (a.name > b.name) ? 1: -1)
      }
    ])
      .then(answers => {
        const sql = `DELETE FROM employee WHERE id = ?`;
        const params = answers.employeeDelete;

        db.query(sql, params, (err, result) => {
          if(err) {
            console.log(err);
          }
          console.log('\n');
          console.log('Delete successful');
          console.log('\n');
          showEmployees();
        });
      });
  });
};

module.exports = { showEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEmployee }