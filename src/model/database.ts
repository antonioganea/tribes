import fs from 'fs';
import { Commands } from './commands';
import { MilitaryUnitType } from './militaryunit';

/*
Todo : Please consider the following
https://github.com/JoshuaWise/better-sqlite3/blob/115258a10675a880e5cf0a22efb60f82a8d5145c/docs/performance.md
*/

var dir = './database';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

export const db = require('better-sqlite3')('./database/gamestate.db');

let initializeUsersStmt = db.prepare(`CREATE TABLE IF NOT EXISTS "users" (
	"userID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"username"	TEXT NOT NULL UNIQUE,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL
);`)

let initializeResourcesStmt = db.prepare(`CREATE TABLE IF NOT EXISTS "resources" (
	"villageID"	INTEGER NOT NULL PRIMARY KEY UNIQUE,
	"checkpointTime"	INTEGER NOT NULL DEFAULT '0',
	"wood"	INTEGER NOT NULL DEFAULT '0',
	"metal"	INTEGER NOT NULL DEFAULT '0',
	"clay"	INTEGER NOT NULL DEFAULT '0',
	"food"	INTEGER NOT NULL DEFAULT '0',
  FOREIGN KEY(villageID) REFERENCES villages(villageID)
);`)

let initializeBuildingsStmt = db.prepare(`CREATE TABLE IF NOT EXISTS "buildings" (
	"villageID"	INTEGER NOT NULL UNIQUE PRIMARY KEY,
	"cityHall"	INTEGER NOT NULL DEFAULT '0',
	"barracks"	INTEGER NOT NULL DEFAULT '0',
	"wall"	INTEGER NOT NULL DEFAULT '0',
	"mine"	INTEGER NOT NULL DEFAULT '0',
	"lumberjack"	INTEGER NOT NULL DEFAULT '0',
	"claymine"	INTEGER NOT NULL DEFAULT '0',
	"farm"	INTEGER NOT NULL DEFAULT '0',
	FOREIGN KEY(villageID) REFERENCES villages(villageID)
);`)

function generateMilitaryCollectionColumns() : string{

	let output = "";

	const values = Object.values(MilitaryUnitType);
	values.forEach((value, index) => {
		output += `"` + value + `"	INTEGER NOT NULL DEFAULT '0',`
	});

	output = output.substring(0,output.length-1);

	//console.log(output);

	return output;
}

let initializeMilitaryCollectionStmt = db.prepare(`CREATE TABLE IF NOT EXISTS "military" (
	"militaryID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,`
	+ generateMilitaryCollectionColumns()
	/*
	"Swordsman"	INTEGER NOT NULL DEFAULT '0',
	"Axeman"	INTEGER NOT NULL DEFAULT '0',
	"Spearman"	INTEGER NOT NULL DEFAULT '0',
	"Archer"	INTEGER NOT NULL DEFAULT '0',
	"Chivalry"	INTEGER NOT NULL DEFAULT '0',
	"AdvChivalry"	INTEGER NOT NULL DEFAULT '0',
	"Noble"	INTEGER NOT NULL DEFAULT '0'
	*/
	+ `);`
)

let initializeVillagesStmt = db.prepare(`CREATE TABLE IF NOT EXISTS "villages" (
	"villageID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"userID" INTEGER NOT NULL,
	"name"	TEXT NOT NULL UNIQUE,
	"positionX"	INTEGER NOT NULL,
	"positionY"	INTEGER NOT NULL,
	"militaryID" INTEGER NOT NULL UNIQUE,
	FOREIGN KEY(userID) REFERENCES users(userID),
	FOREIGN KEY(militaryID) REFERENCES military(militaryID)
);`)

function initDatabase(){
  initializeUsersStmt.run();
  initializeMilitaryCollectionStmt.run();
  initializeVillagesStmt.run();
  initializeResourcesStmt.run();
  initializeBuildingsStmt.run();

  Commands.databaseInit(db);

  console.log("Database initialized!");
}
initDatabase();


let insertUserStmt = db.prepare(`INSERT INTO "main"."users"("username", "email","password") VALUES (?,?,?);`);

export function insertUser(username: string, email: string, password: string){
  try{
    insertUserStmt.run(username, email, password);
  } catch(e) {
    console.log(e)
  }
}

let findUserStmt = db.prepare(`SELECT * FROM users WHERE username=? LIMIT 1;`);

export function findUser(username: any, cb: any){
  try{
    let user = findUserStmt.get(username);
    cb(null, user);
  } catch(e) {
    cb(e)
  }
}