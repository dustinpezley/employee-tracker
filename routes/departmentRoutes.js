const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Define each method as a function to use in server file.
// Show departments in console
showDepartments = () => {
  router.get('/departments', (req,res) => {
    console.alert('Showing all departments...\n');
    const sql = `SELECT * FROM department`;

    db.promise().query(sql, (err, rows) => {
      if(err) {
        console.warn(err);
      }
      console.table(rows);
    });
  });
};

// Add a department
addDepartment = (departmentName) => {
  router.post('/departments', (req, res) => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    const params = [departmentName];

    db.promise().query(sql, params, (err, result) => {
      if(err) {
        console.warn(err);
      }
      console.alert(`Successfully added ${departmentName} to departments.`);
    });
  });
};

// Delete a department
deleteDepartment = () => {
  const currentDeptSql = `SELECT * FROM department`;

  db.promise().query(currentDeptSql, (err,rows) => {
    if(err) {
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
      const params = departmentDeleteChoice.departmentDelete;

      db.promise().query(sql, params, (err, result) => {
        if(err) {
          console.warn(err);
        }
        console.alert('Delete successful.');
        
        showDepartments();
      });
    });
  });
};

module.exports = router;
module.exports = { showDepartments, addDepartment, deleteDepartment };