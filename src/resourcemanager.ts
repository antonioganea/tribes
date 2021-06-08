import { Building } from "./building";
import { getResourceDelta, newResourceCollection, ResourceCollection, ResourceType } from "./resources";
import { Village } from "./village";

export class ResourceManager{
    private village : Village;

    constructor ( village : Village, date : Date ){
        this.village = village;
        this.resourceCheckpoint = date;
    }

    private resourceCheckpoint : Date;
    private checkpointResources: ResourceCollection = newResourceCollection();

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
        let generatorLevel = this.village.getGeneratorByResourceType(resourceType).getLevel();
        let resourceDelta = getResourceDelta(this.resourceCheckpoint, resourceType, generatorLevel);

        return this.checkpointResources[resourceType] + resourceDelta;
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