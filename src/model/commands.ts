// Types of commands

import { BuildingType } from "./building";
import { MilitaryCollection } from "./militaryunit";
import { VillageHandle } from "./objectwrappers";
import { ResourceCollection } from "./resources";

// one time:
// update building
// attack
// trade

export enum CommandType{
    upgradeBuilding,
    trainTroops,
    attackVillage,
    tradeItems
}
  
export namespace Commands{
    export function databaseInit(db){
        let initializeUpgradeCommand = db.prepare(`CREATE TABLE IF NOT EXISTS "upgradeCommands" (
            "commandID"	INTEGER NOT NULL UNIQUE PRIMARY KEY,
            "time" INTEGER NOT NULL DEFAULT '0',
            "villageID"	INTEGER NOT NULL DEFAULT '0',
            "BuildingType"	INTEGER NOT NULL DEFAULT '0',
            FOREIGN KEY(villageID) REFERENCES villages(villageID)
        );`)

        let initializeTrainTroopsCommand = db.prepare(`CREATE TABLE IF NOT EXISTS "trainTroopsCommands" (
            "commandID"	INTEGER NOT NULL UNIQUE PRIMARY KEY,
            "time" INTEGER NOT NULL DEFAULT '0',
            "villageID"	INTEGER NOT NULL DEFAULT '0',
            "militaryID" INTEGER NOT NULL UNIQUE,
            FOREIGN KEY(villageID) REFERENCES villages(villageID),
            FOREIGN KEY(militaryID) REFERENCES military(militaryID)
        );`)

        let initializeAttackCommand = db.prepare(`CREATE TABLE IF NOT EXISTS "attackCommands" (
            "commandID"	INTEGER NOT NULL UNIQUE PRIMARY KEY,
            "time" INTEGER NOT NULL DEFAULT '0',
            "villageID"	INTEGER NOT NULL DEFAULT '0',
            "targetID" INTEGER NOT NULL DEFAULT '0',
            "militaryID" INTEGER NOT NULL UNIQUE,
            FOREIGN KEY(villageID) REFERENCES villages(villageID),
            FOREIGN KEY(targetID) REFERENCES villages(villageID),
            FOREIGN KEY(militaryID) REFERENCES military(militaryID)
        );`)

        initializeUpgradeCommand.run();
        initializeTrainTroopsCommand.run();
        initializeAttackCommand.run();
    }

    export function QueueUpgrade(time : number, village : VillageHandle, buildingType : BuildingType) : void {
        // logica
    }

    export function QueueTrainTroops( time : number, village : VillageHandle, troops : MilitaryCollection ) : void {
        
    }

    export function QueueAttack( time : number, village : VillageHandle, target : VillageHandle, troops : MilitaryCollection ) : void {

    }

    export function QueueTrade( time : number, village : VillageHandle, target : VillageHandle, seller : ResourceCollection, buyer : ResourceCollection ) : void {

    }

    // TODO : implement
    export function GetCommandsForVillage( villageID: number ) {

    }

    // TODO : implement
    export function ExecutionTick(){

    }

    function ExecuteUpgrade( village : VillageHandle, buildingType : BuildingType) : void {
        village.buildings.upgradeLevel(buildingType);
    }

    function ExecuteTrainTroops( village : VillageHandle, troops: MilitaryCollection) : void {

    }

    function ExecuteAttack( village : VillageHandle, target : VillageHandle, troops : MilitaryCollection) : void {

    }
    
    function ExecuteTrade( village : VillageHandle, target : VillageHandle, seller : ResourceCollection, buyer : ResourceCollection ) : void {

    }
}