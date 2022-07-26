const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Define each method as a function to use in app file.
// Show departments in console
showDepartments = () => {
  console.alert('Showing all departments...\n');
  const sql = `SELECT * FROM department`;

  db.promise().query(sql, (err, rows) => {
    if (err) {
      console.warn(err);
    }
    console.table(rows);
  });
};

// Add a department
addDepartment = (departmentName) => {
  const sql = `INSERT INTO departments (name) VALUES (?)`;
  const params = [departmentName];

  db.promise().query(sql, params, (err, result) => {
    if (err) {
      console.warn(err);
    }
    console.alert(`Successfully added ${departmentName} to departments.`);
  });
};

// Delete a department
deleteDepartment = () => {
  const currentDeptSql = `SELECT * FROM department`;

  db.promise().query(currentDeptSql, (err, rows) => {
    if (err) {
      console.warn(err);
    }
    const dept = rows.map(({ id, name }) => ({ key: id, value: name }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'departmentDelete',
        message: 'What department would you like to delete?',
        choices: dept
      }
    ])
      .then(departmentDeleteChoice => {
        const sql = `DELETE FROM department WHERE id= ?`;
        const params = Object.keys(departmentDeleteChoice);

        console.log(params);
        db.promise().query(sql, params, (err, result) => {
          if (err) {
            console.warn(err);
          }
          console.alert('Delete successful.');

          showDepartments();
        });
      });
  });
};

// View employees by department
showDepartmentEmployees = () => {
  const sql = `SELECT name AS department, CONCAT(employee.first_name, " ", employee.last_name) AS employee_name, role.title AS role LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id ORDER BY department`;
  db.promise().query(sql, (err, rows) => {
    if(err) {
      console.warn(err);
    }
    console.alert('Showing current employees and role within each department...');
    console.table(rows);
  })
}

//View department budgets
showDepartmentBudgets = () => {
  const sql = `SELECT name AS department, SUM(role.salary) AS budget FROM department LEFT JOIN role ON department.id = role.department_id GROUP BY department`;
  db.promise().query(sql, (err,rows) => {
    if(err) {
      console.warn(err);
    }
    console.alert('Showing current department budget utilization...');
    console.table(rows);
  })
}

module.exports = { showDepartments, addDepartment, deleteDepartment, showDepartmentEmployees, showDepartmentBudgets };