import { Barracks, Building, ResourceGenerator, BuildingType, CityHall, ClayMine, Farm, Lumberjack, Mine, Wall } from "./building";
import { ResourceType } from "./resources";

export class BuildingManager{
    private cityHall : CityHall;
    private barracks : Barracks;
    private wall : Wall;
    private mine : Mine;
    private lumberjack : Lumberjack;
    private claymine : ClayMine;
    private farm : Farm;

    constructor(){
        this.cityHall = new CityHall();
        this.barracks = new Barracks();
        this.wall = new Wall();
        this.mine = new Mine();
        this.lumberjack = new Lumberjack();
        this.claymine = new ClayMine();
        this.farm = new Farm();
    }

    public getBuilding( buildingName : BuildingType ) : Building {
        switch(buildingName){
            case BuildingType.Mine:
                return this.mine;
            case BuildingType.Lumberjack:
                return this.lumberjack;
            case BuildingType.ClayMine:
                return this.claymine;
            case BuildingType.Farm:
                return this.farm;
            case BuildingType.Barracks:
                return this.barracks;
            case BuildingType.CityHall:
                return this.cityHall;
            case BuildingType.Wall:
                return this.wall;
        }
    }

    public getGeneratorByResourceType( resourceType : ResourceType ) : ResourceGenerator {
        switch(resourceType){
            case ResourceType.Metal:
                return this.mine;
            case ResourceType.Wood:
                return this.lumberjack;
            case ResourceType.Clay:
                return this.claymine;
            case ResourceType.Food:
                return this.farm;
        }
    }
}