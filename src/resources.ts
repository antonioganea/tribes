export enum ResourceType {
    Wood = "Wood",
    Clay = "Clay",
    Food = "Food",
    Metal = "Metal"
}

// A Resource Collection can hold an array like this:
// { Wood: 400, Metal : -50, Clay: 502, Food : 15 }
export type ResourceCollection = { [key in ResourceType]: number}

export function newResourceCollection() : ResourceCollection{
    let obj: { [key : string]: number} = {}
    for (let item in ResourceType) {
        if (typeof (item) == "string") {
            obj[item] = 0;
        }
    }
    return <ResourceCollection> obj
}

// Resource Rates Data
export const ResourceRatesData : { [key in ResourceType]: number[] } = {
    // This describes the hourly rate, for each material, based by generator structure level.
    [ResourceType.Wood]  :     [5, 10, 25, 50, 100],
    [ResourceType.Clay]  :     [5, 10, 25, 50, 100],
    [ResourceType.Food]  :     [5, 10, 25, 50, 100],
    [ResourceType.Metal] :     [5, 10, 25, 50, 100],
}

// Resource Type Data
class RTData {
    constructor(readonly resourceType: ResourceType, longName: string){}
}

export const ResourceTypeData : { [key in ResourceType]: RTData} = {
   [ResourceType.Wood]  :     new RTData(ResourceType.Wood, "Wood"),
   [ResourceType.Clay]  :     new RTData(ResourceType.Clay, "Clay"),
   [ResourceType.Food]  :     new RTData(ResourceType.Food, "Food"),
   [ResourceType.Metal] :     new RTData(ResourceType.Metal, "Metal"),
}

export function getResourceDelta( checkpoint: Date, resourceType: ResourceType, generatorLevel: number ) : number{
    let now = new Date();
    let deltaSeconds = now.getSeconds() - checkpoint.getSeconds();
    let deltaHours = deltaSeconds/1000.0;
    let deltaMaterial = Math.floor(deltaHours * ResourceRatesData[resourceType][generatorLevel]);

    return deltaMaterial;
}

/**
 * Negates a ResourceCollection object in-place.
 */
export function negateResourceCollection( resources: ResourceCollection ){
    for (const [resourceType, requiredCount] of Object.entries(resources)) {
        resources[<ResourceType>resourceType] = -requiredCount;
    }
}