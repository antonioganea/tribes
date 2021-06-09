import { db } from "./database";
import { WorldPosition } from "./utils";
import { Village } from "./village";


// TODO : find a better name for this interface?
/**
 * Interface for entities that can be in the world grid. Used for villages, forests, mountains, etc.
 */

/*
export interface WorldCellObject{
    getWorldPosition() : WorldPosition;
}

export class Forest implements WorldCellObject{
    private worldPosition : WorldPosition;
    constructor( worldPosition : WorldPosition ){
        this.worldPosition = worldPosition;
    }

    public getWorldPosition() : WorldPosition{
        return this.worldPosition;
    }
}

export class World{
    public static readonly WORLD_SIZE : number = 1000;

    public villages: Village[] = [];

    // userToVillage[username] = [villages]
    public userVillages : { [key : string]: Village[]} = {};

    private worldMap: WorldCellObject[][];

    constructor() {
        this.initWorldMap();
    }

    private initWorldMap(){
        // Create a WORLD_SIZE x WORLD_SIZE matrix
        this.worldMap = new Array<Array<WorldCellObject>>();
        for (let y = 0; y < World.WORLD_SIZE; y++) {
            let row :WorldCellObject[]  = new Array<WorldCellObject>();      
            this.worldMap.push(row);
        }
    }

    public getCell( x : number, y : number ) : WorldCellObject {
        return this.worldMap[y][x];
    }

    public getUserVillages( username: string) : Village[]{
        return this.userVillages[username];
    }

    public registerVillage( village: Village ) : void{
        let username: string = village.getUser().getUsername();

        this.villages.push(village);

        if ( !this.userVillages[username] ){
            this.userVillages[username] = [];
        }
        this.userVillages[username].push(village);

        let worldPos : WorldPosition = village.getWorldPosition();
        // TODO : assert - check to see if the cell isn't already taken, else, throw error
        this.worldMap[worldPos.y][worldPos.x] = village;
    }

    public addForest( x : number, y : number ) : void {
        // TODO : asserts on x,y, space availability, etc

        let newForest = new Forest(new WorldPosition(x,y));
        this.worldMap[y][x] = newForest;
    }

    public isWorldPositionEmpty( worldPosition: WorldPosition ) : boolean {
        return this.isPositionEmpty(worldPosition.x, worldPosition.y);
    }

    public isPositionEmpty( x: number, y: number) : boolean {
        if ( x < 0 || x >= World.WORLD_SIZE || y < 0 || y >= World.WORLD_SIZE ){
            throw new Error("Invalid coordinates!");
        }

        return !this.worldMap[y][x]
    }

    public allocateEmptyPosition() : WorldPosition {
        // TODO: implement a better allocator.
        for ( let x = 500; x < 1000; x++ ){
            for ( let y =  500; y < 1000; y++ ){
                if (this.isPositionEmpty(x,y)){
                    return new WorldPosition(x,y);
                }
            }
        }
        throw new Error("World full! World position allocator failure!");
    }

    public getMapChunk( x : number, y : number, w : number, h : number ) : Array<Array<WorldCellObject>> {

        if ( x < 0 || x+w-1 >= World.WORLD_SIZE || y < 0 || y+h-1 >= World.WORLD_SIZE ){
            throw new Error("Invalid coordinates or outside the map!");
        }

        let initialX = x;
        let initialY = y;

        let result: WorldCellObject[][] = new Array<Array<WorldCellObject>>();

        for ( ; y < initialY + h; y++ ){
            let row : WorldCellObject[]  = new Array<WorldCellObject>();
            result[y-initialY] = row;
            for ( let x = initialX; x < initialX + w; x++ ){
                if (!this.isPositionEmpty(x,y)){
                    result[y-initialY][x-initialX] = this.worldMap[y][x];
                }
            }
        }

        return result;
    }

}
*/

export namespace World{
    export const WORLD_SIZE : number = 1000; // TODO add asserts for this

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

        if ( x < 0 || x+w-1 >= World.WORLD_SIZE || y < 0 || y+h-1 >= World.WORLD_SIZE ){
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

}