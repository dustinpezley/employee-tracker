//=====Dependencies=====//
const db = require('./db/connection');
const terminalInterface = require('./lib/index');


db.connect(err => {
  if (err) throw err;
  // Log logo into terminal
  console.log("+-------------------------------------------------------+");
  console.log("|                                                       |");
  console.log("|     _____                 _                           |");
  console.log("|    |  ___|_ __ ___  _ __ | | ___  _   _  ___  ___     |");
  console.log("|    |  _| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\    |");
  console.log("|    | |___| | | | | | |_) | | (_) | |_| |  __/  __/    |");
  console.log("|    |_____|_| |_| |_| .__/|_|\\___/\\___, |\\___|\\___|    |");
  console.log("|                    |_|            |___/               |");
  console.log("|     __  __                                            |");
  console.log("|    |  \\/  | __ _ _ __   __ _  __ _  ___ _ __          |");
  console.log("|    | |\\/| |/ _` | '_ \\ / _` |/ _` |/ _ \\ '__|         |");
  console.log("|    | |  | | (_| | | | | (_| | (_| |  __/ |            |");
  console.log("|    |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|            |");
  console.log("|                               |__/                    |");
  console.log("|                                                       |");
  console.log("+-------------------------------------------------------+");

  // Confirm database connection
  console.log('Database connected.');

  terminalInterface();
});