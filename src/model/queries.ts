import { BuildingType } from "./building";
import { db } from "./database";
import { MilitaryCollection, MilitaryUnitType } from "./militaryunit";
import { VillageHandle } from "./objectwrappers";
import { WorldPosition } from "./utils";

export namespace Globals{
    export const WORLD_SIZE : number = 1000; // TODO add asserts for this

    export function init(){
        generateBuildingLevelQueries();
        generateMilitaryQueries();
    }

    let createVillageStmt = db.prepare(`INSERT INTO "villages" (userID, name, positionX, positionY, militaryID) VALUES (?,?,?,?,?);`);
    let createEmptyBuildingsStmt = db.prepare(`INSERT INTO "buildings" (villageID) VALUES (?);`);
    let createEmptyMilitaryStmt = db.prepare(`INSERT INTO "military" (Axeman) VALUES (0);`); // TODO : this just needs to insert empty record but uses Axeman (hardcoded)
    let createEmptyResourcesStmt = db.prepare(`INSERT INTO "resources" (villageID, checkpointTime) VALUES (?,?);`);

    export function createVillage(userID : number, name : string, x : number, y : number) : VillageHandle {
        let militaryID = createEmptyMilitaryStmt.run().lastInsertRowid;
        
        let info = createVillageStmt.run(userID, name, x, y, militaryID);
        console.log(info)
        createEmptyBuildingsStmt.run(info.lastInsertRowid);
        
        createEmptyResourcesStmt.run(info.lastInsertRowid, Math.floor(new Date().getTime() / 1000));
        console.log("Village created!");

        return new VillageHandle(info.lastInsertRowid);
    }

    let getVillageMilitaryStmt = db.prepare(`SELECT MILITARY.* FROM MILITARY INNER JOIN villages ON villages.militaryID = military.militaryID WHERE villages.villageID=? LIMIT 1;`);
    export function getVillageMilitary( villageID : number ) : any {
        return getVillageMilitaryStmt.get(villageID);
    }

    let getVillageBuildingsStmt = db.prepare(`SELECT * FROM "buildings" WHERE villageID=? LIMIT 1;`);
    export function getVillageBuildings( villageID : number ) : any {
        return getVillageBuildingsStmt.get(villageID);
    }

    let getVillageResourcesStmt = db.prepare(`SELECT * FROM "resources" WHERE villageID=? LIMIT 1;`);
    export function getVillageResources( villageID : number ) : any {
        return getVillageResourcesStmt.get(villageID);
    }

    let getVillageCountAtPositionStmt = db.prepare(`SELECT COUNT(*) as cnt FROM "villages" WHERE positionX=? AND positionY=?;`);

    export function isVillageAtPosition( x : number, y : number ) : boolean {
        let count = getVillageCountAtPositionStmt.get(x, y).cnt;
        return count != 0;
    }

    export function isPositionOccupied( x : number, y : number ) : boolean {
        // Add a more complicated condition when this gets complicated. ( forests, mountains. other entities.. )
        // Right now it only depends if there is a village at the given position
        return isVillageAtPosition(x, y);
    }

    let getVillagesInRectangleStmt = db.prepare(`SELECT * FROM "villages" WHERE positionX BETWEEN ? AND ? AND positionY BETWEEN ? AND ?;`);
    export function getMapChunk( x : number, y : number, w : number, h : number ) : any {

        if ( x < 0 || x+w-1 >= Globals.WORLD_SIZE || y < 0 || y+h-1 >= Globals.WORLD_SIZE ){
            throw new Error("Invalid coordinates or outside the map!");
        }

        let data = getVillagesInRectangleStmt.all(x, x+w-1, y, y+h-1);

        let result: any[][] = new Array<Array<any>>();

        let initialY = y;

        for ( ; y < initialY + h; y++ ){
            let row : any[]  = new Array<any>();
            result[y-initialY] = row;
        }

        for ( let i = 0; i < data.length; i++ ){
            result[data[i].positionY - initialY][data[i].positionX - x] = data[i];
        }

        return result;
    }

    let getUserVillagesStmt = db.prepare(`SELECT * FROM "villages" WHERE userID=?;`);
    export function getUserVillages( userID : number ) : any[] {
        let villages = getUserVillagesStmt.all(userID);
        return villages;
    }

    let getVillageStmt = db.prepare(`SELECT * FROM "villages" WHERE villageID=? LIMIT 1;`);
    export function getVillage( villageID : number ) : any {
        let village = getVillageStmt.get(villageID);
        return village;
    }

    let getVillageNameStmt = db.prepare(`SELECT name FROM "villages" WHERE villageID=? LIMIT 1;`);
    export function getVillageName( villageID : number ) : string {
        let village = getVillageNameStmt.get(villageID);
        return village.name;
    }

    let getVillagePositionStmt = db.prepare(`SELECT positionX, positionY FROM "villages" WHERE villageID=? LIMIT 1;`);
    export function getVillagePosition( villageID : number ) : WorldPosition {
        let village = getVillagePositionStmt.get(villageID);
        return new WorldPosition(village.locationX, village.locationY);
    }

    let getVillageOwnerIDStmt = db.prepare(`SELECT userID FROM "villages" WHERE villageID=? LIMIT 1;`);
    export function getVillageOwnerID( villageID: number ) : number {
        let village = getVillageOwnerIDStmt.get(villageID);
        return village.userID;
    }

    let findUserStmt = db.prepare(`SELECT * FROM users WHERE userID=? LIMIT 1;`);
    export function getUserWithID( userID : number ) : any {
        return findUserStmt.get(userID);
    }

    let getUserIdByUsernameStmt = db.prepare(`SELECT userID FROM users WHERE username=? LIMIT 1;`);
    export function getUserIDByUsername( username : string ) : number {
        return getUserIdByUsernameStmt.get(username).userID;
    }
    
    let getUserPasswordStmt = db.prepare(`SELECT password FROM users WHERE userID=? LIMIT 1;`);
    export function getUserPassword( userID : number ) : string {
        return getUserPasswordStmt.get(userID).password;
    }

    let getUserUsernameStmt = db.prepare(`SELECT username FROM users WHERE userID=? LIMIT 1;`);
    export function getUserUsername( userID : number ) : string {
        return getUserUsernameStmt.get(userID).username;
    }

    let getVillageIdByCoordsStmt = db.prepare(`SELECT villageID FROM villages WHERE positionX=? AND positionY=? LIMIT 1;`);
    export function getVillageIdByCoords( x : number, y : number ) : number {
        return getVillageIdByCoordsStmt.get(x, y).villageID;
    }

    let getAllVillagesOfUserStmt = db.prepare(`SELECT villageID FROM villages WHERE userID=?;`);
    export function getAllVillagesOfUser( userID : number ) : any {
        return getAllVillagesOfUserStmt.all(userID);
    }
    
    let setBuildingLevelStmts = {};
    let getBuildingLevelStmts = {};
    
    function generateBuildingLevelQueries(){
        const values = Object.values(BuildingType);
        values.forEach((value, index) => {
            setBuildingLevelStmts[value] = db.prepare(`UPDATE buildings SET ` + value + ` = ? WHERE villageID = ?;`)
            getBuildingLevelStmts[value] = db.prepare(`SELECT ` + value + ` FROM buildings WHERE villageID = ?;`)
        });
    }

    export function setBuildingLevel( villageID : number, building : BuildingType, level : number ) : any {
        return setBuildingLevelStmts[building].run(level, villageID);
    }

    export function getBuildingLevel( villageID : number, building : BuildingType ) : number {
        return getBuildingLevelStmts[building].get(villageID)[building];
    }

    let setVillageMilitaryStmt;

    function generateMilitaryQueries(){
        let text = "";

        const values = Object.values(MilitaryUnitType);
        values.forEach((value, index) => {
            text += value + " = $" + value + ", ";
        });

        text = text.substring(0,text.length-2);

        setVillageMilitaryStmt = db.prepare(`UPDATE "military" SET ` + text + ` WHERE militaryID = $militaryID;`)
    }

    export function setMilitary( militaryID: number, militaryCollection : MilitaryCollection) {
        let params = {}
        Object.keys(militaryCollection).forEach((value) => {
            params[value] = militaryCollection[value];
        });
        params["militaryID"] = militaryID;

        console.log(params)

        setVillageMilitaryStmt.run(params)
    }
    
    export function setVillageMilitary( villageID : number, militaryCollection : MilitaryCollection ) : any {
        let village = getVillage(villageID)
        setMilitary(village.militaryID, militaryCollection)
    }
}

Globals.init();