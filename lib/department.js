const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Define each method as a function to use in app file.
// Show departments in console
function showDepartments() {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.log('\n');
    console.log('Showing all departments...\n');
    console.table(rows);
  });
};

// Add a department
function addDepartment(departmentName) {
  const sql = `INSERT INTO department (name) VALUES (?)`;
  const params = [departmentName];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('\n');
      console.log(`Successfully added ${departmentName} to departments.`);
      console.log('\n');
      showDepartments();
    }
  });
};

// Delete a department
function deleteDepartment() {
  const currentDeptSql = `SELECT * FROM department`;

  db.query(currentDeptSql, async (err, rows) => {
    if (err) {
      console.log(err);
    }
    const dept = rows.map(({ id, name }) => ({ name, value: id }));

    await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentDelete',
        message: 'What department would you like to delete?',
        choices: dept
      }
    ])
      .then(answers => {
        const sql = `DELETE FROM department WHERE id= ?`;
        const params = answers.departmentDelete;

        console.log(params);
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log('\n');
          console.log('Delete successful.');
          console.log('\n');
          showDepartments();
        });
      });
  });
};

// View employees by department
function showDepartmentEmployees() {
  const params = [];
  const currentDeptEmpSql = `SELECT * FROM department`;
  db.query(currentDeptEmpSql, async (err, rows) => {
    if (err) {
      console.log(err);
    }

    const department = rows.map(({ id, name }) => ({ name: name, value: id }));

    await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentSelect',
        message: "Which department's employees do you want to see?",
        choices: department
      }
    ])
    .then(answers => {
      const departmentSelect = answers.departmentSelect;
      params.push(departmentSelect);
    });

    console.log(params);
    const sql = `SELECT department.name AS department, CONCAT(employee.first_name, " ", employee.last_name) AS employee_name, role.title AS role, CONCAT('$',FORMAT(role.salary,0)) AS salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.id = ?`;
    db.query(sql, params, (err, rows) => {
      if(err) {
        console.log(err);
      }
      console.log('\n');
      console.log('Showing current employees and role within selected department...\n');
      console.table(rows);
    });
  });
};

//View department budgets
function showDepartmentBudgets() {
  const sql = `SELECT department.name AS department, CONCAT('$',FORMAT(SUM(role.salary),0)) AS budget FROM role INNER JOIN department ON role.department_id = department.id GROUP BY department`;
  db.query(sql, (err,rows) => {
    if(err) {
      console.log(err);
    }
    console.log('\n');
    console.log('Showing current department budget utilization...\n');
    console.table(rows);
  })
}

module.exports = { showDepartments, addDepartment, deleteDepartment, showDepartmentEmployees, showDepartmentBudgets };