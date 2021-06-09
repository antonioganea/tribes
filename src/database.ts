import fs from 'fs';

/*
CREATE TABLE `resources` (
	`villageID`	INTEGER NOT NULL PRIMARY KEY UNIQUE,
	`checkpointTime`	INTEGER NOT NULL DEFAULT '0',
	`wood`	INTEGER NOT NULL DEFAULT '0',
	`metal`	INTEGER NOT NULL DEFAULT '0',
	`clay`	INTEGER NOT NULL DEFAULT '0',
	`food`	INTEGER NOT NULL DEFAULT '0',
  FOREIGN KEY(villageID) REFERENCES villages(villageID)
);

CREATE TABLE `users` (
	`userID`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`username`	TEXT NOT NULL UNIQUE,
	`email`	TEXT NOT NULL,
	`password`	TEXT NOT NULL
);

CREATE TABLE `buildings` (
	`villageID`	INTEGER NOT NULL UNIQUE PRIMARY KEY,
	`cityHall`	INTEGER NOT NULL DEFAULT '0',
	`barracks`	INTEGER NOT NULL DEFAULT '0',
	`wall`	INTEGER NOT NULL DEFAULT '0',
	`mine`	INTEGER NOT NULL DEFAULT '0',
	`lumberjack`	INTEGER NOT NULL DEFAULT '0',
	`claymine`	INTEGER NOT NULL DEFAULT '0',
	`farm`	INTEGER NOT NULL DEFAULT '0',
	FOREIGN KEY(villageID) REFERENCES villages(villageID)
);

CREATE TABLE `villages` (
	`villageID`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`userID` INTEGER NOT NULL,
	`name`	TEXT NOT NULL UNIQUE,
	`positionX`	INTEGER NOT NULL,
	`positionY`	INTEGER NOT NULL,
	FOREIGN KEY(userID) REFERENCES users(userID)
);

*/


const sqlite3 = require('sqlite3').verbose();

var dir = './database';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

let sqldb = new sqlite3.Database('./database/users.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: any) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');

  sqldb.serialize(() => {

    sqldb.run(`CREATE TABLE IF NOT EXISTS "users" (
      "username"	TEXT NOT NULL UNIQUE,
      "email"     TEXT NOT NULL,
      "password"	TEXT NOT NULL
    );`)
  
    console.log("sqlite db init'd")
  });
});

export function insertUser(username: string, email: string, password: string){
  sqldb.serialize(() => {
		sqldb.run(`INSERT INTO "main"."users"("username", "email","password") VALUES (?,?,?);`, username, email, password, function (err : any){
			if (err) {
				console.log (err)
			}
		})
	});
}

export function findUser(username: any, cb: any){
  sqldb.serialize(() => {
		sqldb.all(`SELECT * FROM users WHERE username=? LIMIT 1;`, username, (err: any, rows : any) => {
		  if (err) {
        console.error(err.message);
        cb("error sqlite", "error sqlite")
		  }
		  else {
        //console.log(rows);
        //console.log(rows.length);
        if (rows.length == 1) {
          cb(null, rows[0]);
        }
        else {
          cb("error : not registered", "not registered");
        }
		  }
		});
	});
}

export function getUsersWithSubstring(substring : any, cb : any) {
    let searchString = substring;
    console.log(`SELECT username FROM users WHERE username LIKE \'%` + substring + "%\';");
    sqldb.serialize(() => {
          sqldb.all(`SELECT username FROM users WHERE username LIKE \'%` + substring + "%\';", (err: any, rows : any) => {
            if (err) {
              console.error(err.message);
              }
            else{
           cb(rows);
            }
          });
      });
  }