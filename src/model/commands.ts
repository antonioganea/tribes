// Types of commands

import { MilitaryCollection } from "./militaryunit";
import { BuildingType, VillageHandle } from "./objectwrappers";
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