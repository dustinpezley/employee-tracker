const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Define each method as a function to use in app file.
// Show roles in console
showRoles = () => {
  console.alert('Showing all roles...\n');
  const sql = `SELECT * FROM role`;

  db.promise().query(sql, (err, rows) => {
    if (err) {
      console.warn(err);
    }
    console.table(rows);
  });
};

// Add a role
addRole = (roleName, salary) => {
  const params = [roleName, salary];

  const currentDeptSql = `SELECT name, id FROM department`;
  db.promise().query(currentDeptSql, (err, rows) => {
    if (err) {
      console.warn(err);
    }
    const dept = rows.map(({ id, name }) => ({ key: id, value: name }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'departmentForRole',
        message: 'In which department is this role?',
        choices: dept
      }
    ])
      .then(departmentForRoleChoice => {
        const roleDepartment = departmentForRoleChoice.dept;
        params.push(roleDepartment);
      })
  })
  console.log(params);
  const sql = `INSERT INTO role (roleName, salary, department) VALUES (?,?,?)`;

  db.promise().query(sql, params, (err, result) => {
    if (err) {
      console.warn(err)
    }
    console.alert(`Successfully added ${roleName} to roles.`);
  });
};

deleteRole = () => {
  const currentRoleSql = `SELECT * FROM role`;

  db.promise().query(currentRoleSql, (err, rows) => {
    if (err) {
      console.warn(err)
    }
    const roles = rows.map(({ id, title }) => ({ key: id, value: title }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'roleDelete',
        message: 'Which role would you like to delete?',
        choices: roles
      }
    ])
      .then(roleDeleteChoice => {
        const sql = `DELETE FROM role WHERE id = ?`;
        const params = Object.keys(roleDeleteChoice);

        db.promise().query(sql, params, (err, result) => {
          if (err) {
            console.warn(err)
          }
          console.alert('Delete successful.');

          showRoles();
        })
      })
  })
}

module.exports = { showRoles, addRole, deleteRole }