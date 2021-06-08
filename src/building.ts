/*
abstract class BaseClass {
  protected name : string = "base";
  public getName() : string{
    return this.name;
  }
}

class DerivedClass extends BaseClass {
  constructor(){
    super();
    //this.name = "derived";
  }
}

let d : BaseClass = new DerivedClass();
console.log( d.getName());
*/

export abstract class Building{
    private static readonly longName: string;

    private level: number;
    public getLevel() : number{
        return this.level;
    }
}

export abstract class ResourceGenerator extends Building{

}

export class CityHall extends Building{

}

export class Barracks extends Building{

}

export class Wall extends Building{
  
}

export class Mine extends ResourceGenerator{

}

export class Lumberjack extends ResourceGenerator{
    
}


export class Farm extends ResourceGenerator{
    
}


export class ClayMine extends ResourceGenerator{
    
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