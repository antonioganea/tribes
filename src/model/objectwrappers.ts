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

    // TODO : implement
    export function getVillageByCoords(x : number, y : number) : VillageHandle {
        return new VillageHandle(1);
    }

    export function getUser(userID : number) : UserHandle {
        return new UserHandle(userID);
    }

    // TODO : implement
    export function getUserByName(name : string) : UserHandle {
        return new UserHandle(1);
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

    // TODO : implement
    get username() : string{
        return "username";
    }

    // TODO : implement
    get password() : string{
        return "password";
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