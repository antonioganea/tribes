/**
 * This file describes the object-like wrappers used in this codebase architecture.
 */

import { WorldPosition } from "./utils";


/*
 World.getVillage(villageID) |
 |.getVillage(X,Y)       |
                         \=> VillageHandle
\+ .id => number
\+ .getName() => string
\+ .getLocation() => WorldPosition
\+ .getDBRow() => any ( object )

getUser(userName)|
getUser(userID)  |
              \=> UserHandle

.id => number
.getUsername() => string
.getPassword() => string
.getDBRow() => any ( object )
.getVillages() => VillageHandle[]
*/

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
        return "username";
    }

    get password() : string{
        return "password";
    }

    get villages() : VillageHandle[] {
        return [new VillageHandle(50)];
    }

    // Methods

    public getDBRow() : any {
        return null;
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

    // TODO : implement
    get name() : string{
        return "name";
    }

    // TODO : implement
    get location() : WorldPosition {
        return new WorldPosition(50,50);
    }

    // TODO : implement
    get owner() : UserHandle{
        return new UserHandle(5);
    }

    // Methods

    // TODO : implement
    public getDBRow() : any {
        return null;
    }
}