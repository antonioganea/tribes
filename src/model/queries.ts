import { db } from "./database";
import { VillageHandle } from "./objectwrappers";
import { WorldPosition } from "./utils";

export namespace Globals{
    export const WORLD_SIZE : number = 1000; // TODO add asserts for this

    let createVillageStmt = db.prepare(`INSERT INTO "villages" (userID, name, positionX, positionY) VALUES (?,?,?,?);`);
    let createEmptyBuildingsStmt = db.prepare(`INSERT INTO "buildings" (villageID) VALUES (?);`);
    let createEmptyMilitaryStmt = db.prepare(`INSERT INTO "military" (villageID) VALUES (?);`);
    let createEmptyResourcesStmt = db.prepare(`INSERT INTO "resources" (villageID, checkpointTime) VALUES (?,?);`);

    export function createVillage(userID : number, name : string, x : number, y : number) : VillageHandle {
        let info = createVillageStmt.run(userID, name, x, y);
        console.log(info)
        createEmptyBuildingsStmt.run(info.lastInsertRowid);
        createEmptyMilitaryStmt.run(info.lastInsertRowid);
        createEmptyResourcesStmt.run(info.lastInsertRowid, Math.floor(new Date().getTime() / 1000));
        console.log("Village created!");

        return new VillageHandle(info.lastInsertRowid);
    }

    let getVillageMilitaryStmt = db.prepare(`SELECT * FROM "military" WHERE villageID=? LIMIT 1;`);
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
}