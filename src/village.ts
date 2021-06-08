import { Building, ResourceGenerator, BuildingType} from "./building";
import { BuildingManager } from "./buildingmanager";
import { MilitaryCollection, newMilitaryCollection } from "./militaryunit";
import { ResourceManager } from "./resourcemanager";
import { ResourceType } from "./resources";
import { User } from "./user";
import { WorldPosition } from "./utils";
import { WorldCellObject } from "./world";

// https://stackoverflow.com/questions/16261119/typescript-objects-serialization
export class Village implements WorldCellObject {
    // Village major data
    private name : string;
    private worldPosition : WorldPosition;
    private user : User;

    // Building Manager
    private buildingManager : BuildingManager;

    // Resource manager
    private resourceManager : ResourceManager;

    // TODO : maybe encapsulate this in other military manager?
    private military : MilitaryCollection = newMilitaryCollection();

    private constructor(){
        this.resourceManager = new ResourceManager(this, new Date());
        this.buildingManager = new BuildingManager();
    }

    public getName() : string { return this.name; }
    public getUser() : User { return this.user; }
    public getWorldPosition() : WorldPosition { return this.worldPosition; }

    public getResourceCount( resourceType: ResourceType ) : number{
        return this.resourceManager.getCurrentResourceCount(resourceType);
    }

    public getMilitary() : MilitaryCollection { return this.military; }
    public getResourceManager() : ResourceManager { return this.resourceManager; }
    public getBuildingManager() : BuildingManager { return this.buildingManager; }

    public getBuilding( buildingName : BuildingType ) : Building {
        return this.buildingManager.getBuilding(buildingName);
    }

    public getGeneratorByResourceType( resourceType : ResourceType ) : ResourceGenerator {
        return this.buildingManager.getGeneratorByResourceType(resourceType);
    }

    public static createVillage(name : string, worldPosition : WorldPosition, user : User) : Village {
        let newVillage = new Village();

        newVillage.name = name;
        newVillage.worldPosition = worldPosition;
        newVillage.user = user;

        return newVillage
    }
}