/**
 * This file describes the object-like wrappers used in this codebase architecture.
 */

import { BuildingType } from "./building";
import { MilitaryUnitType } from "./militaryunit";
import { Globals } from "./queries";
import { ResourceCollection, ResourceType } from "./resources";
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

    get villages() : VillageHandle[] {
        let data = Globals.getAllVillagesOfUser(this.userID);

        let output : VillageHandle [] = [];

        for ( let i = 0; i < data.length; i++ ){
            output.push(new VillageHandle(data[i].villageID));
        }

        return output;
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

    get military() : MilitaryHandle {
        return new MilitaryHandle(this.villageID);
    }

    get buildings() : BuildingsHandle {
        return new BuildingsHandle(this.villageID);
    }

    get resources() : ResourcesHandle {
        return new ResourcesHandle(this.villageID);
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

export class MilitaryHandle{
    public readonly villageID : number;

    constructor(villageID : number){
        this.villageID = villageID;
    }

    // TODO : implement
    public getCount( militaryUnitType : MilitaryUnitType ) : number {
        return 0;
    }

    // TODO : implement
    public setCount( militaryUnitType : MilitaryUnitType, count : number ) : void {

    }
}

export class BuildingsHandle{
    public readonly villageID : number;

    constructor(villageID : number){
        this.villageID = villageID;
    }

    public setLevel( buildingType : BuildingType, level : number ) : boolean {
        Globals.setBuildingLevel(this.villageID, buildingType, level);
        return true;
    }

    public getLevel( buildingType : BuildingType ) : number {
        return Globals.getBuildingLevel(this.villageID, buildingType);
    }

    // TODO : implement
    public getMaxLevel( buildingType : BuildingType ) : number {
        return 30;
    }

    public upgradeLevel ( buildingType : BuildingType ) : boolean {
        let currentLevel = this.getLevel(buildingType);
        currentLevel += 1;

        if (currentLevel > this.getMaxLevel(buildingType)){
            return false;
        }

        this.setLevel(buildingType, currentLevel);
        return true;
    }
}

export class ResourcesHandle{
    public readonly villageID : number;

    constructor(villageID : number){
        this.villageID = villageID;
    }

    // TODO : implement
    public createCheckpointNow() : void {

    }

    // TODO : implement
    public getCheckpointTime() : number {
        return 0;
    }

    /**
     * This gets the village's resource count for a specific ResourceType at the moment of this function call.
     * This is calculated by knowing what was the last resource count for that type
     * and when that happened ( checkpoint ), and adding the time difference multiplied
     * by the resource producing rate.
     * 
     * @param resourceType
     * 
     * @returns The number of that specified resource at this point in time.
     */
    public getCurrentResourceCount( resourceType: ResourceType ) : number{
        /*
        let generatorLevel = this.village.getGeneratorByResourceType(resourceType).getLevel();
        let resourceDelta = getResourceDelta(this.resourceCheckpoint, resourceType, generatorLevel);

        return this.checkpointResources[resourceType] + resourceDelta;
        */
       return 0;
    }

    /**
     * Given a ResourceCollection object, it checks if at the time of this function being called
     * the village has enough of each necessary resource. ( Acts like a recipe input count validator ).
     * 
     * @scenario You have { metal: 300, wood: 500, clay: 300 }.
     * You have these requirements for some command : requirements = { metal : 200, wood : 200, clay: 400 }.
     * If you call areResourcesAvailable(requirements), it should return false.
     * And that is because you don't have the necessary 400 clay ( you only have 300 )
     * 
     * @returns true if the village owns the required resources, false otherwise.
     */
    public areResourcesAvailable( resources : ResourceCollection ) : boolean{
        for (const [resourceType, requiredCount] of Object.entries(resources)) {
            let actualCount = this.getCurrentResourceCount(<ResourceType> resourceType);

            if ( actualCount < requiredCount ){
                return false;
            }
        }
        
        return true;
    }

    /**
     * Adds the 'resource' ResourceCollection over the village's resources.
     * It also creates a new resource checkpoint!
     * 
     * @Note This should NOT be used for passive generators like mines, farms, etc.
     * It should be used when something non-linear happens such as trading, or wars.
     * ( Because this is why the checkpoint system is used in the first place, to avoid updating
     * every village every minute )
     */
    public addResources( resource: ResourceCollection ) : void {
        // TODO : implement
        // Must check that all values are positive
    }

    public removeResources ( resource: ResourceCollection ) : void {
        // TODO : implement
        // Must check that all values are positive
    }

    /**
     * This acts like a cross between addResources and removeResources.
     * Should be used for trades, when you might give off some materials but also earn some
     * in the same transaction
     * @scenario You have : { metal: 310, wood: 500, clay : 500 }
     * The other player offers 500 wood for 300 metal.
     * This trade can be encoded like this : incomingTrade = { metal: -300, wood : 500, clay: 0 }
     * And so, you have to add value by value your current resources with the resources from 'incomingTrade'
     * Leaving you with : { metal: 10, wood: 1000, clay: 500 }
     */
    public trade( resource: ResourceCollection ) : void {
        // TODO : implement
    }
}