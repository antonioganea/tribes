import { WorldPosition } from "./utils";
import { Village } from "./village";


// TODO : find a better name for this interface?
/**
 * Interface for entities that can be in the world grid. Used for villages, forests, mountains, etc.
 */
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
        /*
        // Village Lookup implementation ( obsolete ), time complexity : O(n), n villages.
        for ( let i = 0; i < this.villages.length; i++ ){
            let worldpos : WorldPosition = this.villages[i].getWorldPosition();
            if (worldpos.x == x && worldpos.y == y){
                return false; // if the space is taken by a certain village
            }
        }
        return true;
        */

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