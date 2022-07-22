const express = require('express');
const db = require('./db/connection');
const prompts = require('./lib/questions');
const { showDepartments, addDepartment, deleteDepartment } = require('./routes/departmentRoutes');

const apiRoutes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api',apiRoutes);

//Default response for any other request (Not Found)
app.use((req,res) => {
  res.status(404).end();
})

db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });

  // Log logo into terminal
  console.log("+-------------------------------------------------------+");
  console.log("|                                                       |");
  console.log("|     _____                 _                           |");
  console.log("|    |  ___|_ __ ___  _ __ | | ___  _   _  ___  ___     |");
  console.log("|    |  _| | '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \    |");
  console.log("|    | |___| | | | | | |_) | | (_) | |_| |  __/  __/    |");
  console.log("|    |_____|_| |_| |_| .__/|_|\___/\___, |\___|\___|    |");
  console.log("|                    |_|            |___/               |");
  console.log("|     __  __                                            |");
  console.log("|    |  \/  | __ _ _ __   __ _  __ _  ___ _ __          |");
  console.log("|    | |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__|         |");
  console.log("|    | |  | | (_| | | | | (_| | (_| |  __/ |            |");
  console.log("|    |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|            |");
  console.log("|                               |__/                    |");
  console.log("|                                                       |");
  console.log("+-------------------------------------------------------+");

  //Call questions
  prompts()
    .then((answers) => {
      const { initialChoices } = answers;

      if(initialChoices === "View all departments") {
        showDepartments();
      }
    });
});