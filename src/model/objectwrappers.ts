/**
 * This file describes the object-like wrappers used in this codebase architecture.
 */

import { Globals } from "./queries";
import { WorldPosition } from "./utils";


/*
 World.getVillage(villageID)     |
     |.getVillageByCoords(X,Y)   |
                                 \=> VillageHandle
\+ .id => number
\+ .getName() => string
\+ .getLocation() => WorldPosition
\+ .getDBRow() => any ( object )

 World.getUser(userName) |
      .getUser(userID)   |
                         \=> UserHandle

.id => number
.getUsername() => string
.getPassword() => string
.getDBRow() => any ( object )
.getVillages() => VillageHandle[]
*/

export namespace World{
    export function getVillage(villageID : number) : VillageHandle {
        return new VillageHandle(villageID);
    }

    export function getVillageByCoords(x : number, y : number) : VillageHandle {
        return new VillageHandle(Globals.getVillageIdByCoords(x, y));
    }

    export function getUser(userID : number) : UserHandle {
        return new UserHandle(userID);
    }

    export function getUserByName(name : string) : UserHandle {
        return new UserHandle(Globals.getUserIDByUsername(name));
    }
}

export enum BuildingType {
    Mine = "Mine",
    Lumberjack = "Lumberjack",
    ClayMine = "ClayMine",
    Farm = "Farm",
    Barracks = "Barracks",
    CityHall = "CityHall",
    Wall = "Wall"
}

export class UserHandle{
    public readonly userID : number;

    constructor(userID : number){
        this.userID = userID;
    }

    // Getters

    get id() : number {
        return this.userID;
    }

    get username() : string{
        return Globals.getUserUsername(this.userID);
    }

    get password() : string{
        return Globals.getUserPassword(this.userID);
    }

    // TODO : implement
    get villages() : VillageHandle[] {
        return [new VillageHandle(50)];
    }

    // Methods

    public getDBRow() : any {
        return Globals.getUserWithID(this.userID);
    }
}

export class VillageHandle{
    public readonly villageID : number;

    constructor(villageID : number){
        this.villageID = villageID;
    }

    // Getters

    get id() : number {
        return this.villageID;
    }

    get name() : string{
        return Globals.getVillageName(this.villageID);
    }

    get location() : WorldPosition {
        return Globals.getVillagePosition(this.villageID);
    }

    get owner() : UserHandle{
        return new UserHandle(Globals.getVillageOwnerID(this.villageID));
    }

    // Methods

    public getDBRow() : any {
        return Globals.getVillage(this.villageID);
    }

    public getPageData() : any {

        let pageData = {
            villageData : this.getDBRow(),
            military : Globals.getVillageMilitary(this.villageID),
            buildings: Globals.getVillageBuildings(this.villageID),
            resources: Globals.getVillageResources(this.villageID),
            owner : this.owner.getDBRow()
            //resources : resources
        };

        return pageData;
    }
}