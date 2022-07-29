const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Define each method as a function to use in app file.
// Show roles in console
function showRoles() {
  const sql = `SELECT role.id, role.title, department.name AS department, CONCAT('$', FORMAT(role.salary, 0)) AS salary FROM role RIGHT JOIN department ON role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.log('\n');
    console.log('Showing all roles...\n');
    console.table(rows);
  });
};

// Add a role
function addRole(roleName, salary) {
  const params = [roleName, salary];

  const currentDeptSql = `SELECT name, id FROM department`;
  db.query(currentDeptSql, async (err, rows) => {
    if (err) {
      console.log(err);
    }
    const dept = rows.map(({ id, name }) => ({ name, value: id }));

    await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentForRole',
        message: 'In which department is this role?',
        choices: dept
      }
    ])
    .then(answers => {
      console.log(answers);
      const roleDepartment = answers.departmentForRole;
      params.push(roleDepartment);
    })
  
    console.log(params);
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;

    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err)
      }
      console.log('\n');
      console.log(`Successfully added ${roleName} to roles.`);
    });
  })
};


function deleteRole() {
  const currentRoleSql = `SELECT * FROM role`;

  db.query(currentRoleSql, async (err, rows) => {
    if (err) {
      console.log(err)
    }
    const roles = rows.map(({ id, title }) => ({ name: title, value: id }));

    await inquirer.prompt([
      {
        type: 'list',
        name: 'roleDelete',
        message: 'Which role would you like to delete?',
        choices: roles
      }
    ])
      .then(answers => {
        const sql = `DELETE FROM role WHERE id = ?`;
        const params = answers.roleDelete;

        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err)
          }
          console.log('\n');
          console.log('Delete successful.');
          console.log('\n');
          showRoles();
        })
      })
  })
}

module.exports = { showRoles, addRole, deleteRole }