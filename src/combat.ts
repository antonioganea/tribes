import { MilitaryCollection } from "./militaryunit";
import { ResourceCollection } from "./resources";
import { Village } from "./village";

/**
 * Utilitary functions collection that deals with wars.
 */
export namespace Combat{

    /**
     * Structure that contains all info related to the outcome of a war.
     */
    export class WarOutcome{
        public remaningAttackers : MilitaryCollection;
        public remainingDefenders : MilitaryCollection;
        public lootTable : ResourceCollection;
    }

    /**
     * This function computes the outcome of a war and returns it as a WarOutcome object.
     * It does NOT modify the input parameters. The changes should then be applied manually after computing them.
     * @param attackers The collection of all the attacking troops
     * @param village The target village
     * @returns a WarOutcome object.
     */
    export function computeWar( attackers : MilitaryCollection, village : Village ) : WarOutcome{
        let outcome : WarOutcome = new WarOutcome();

        // .. implement ..

        return outcome;
    }

    /**
     * Applies the WarOutcome object computed with `computeWar` onto a village.
     * @param outcome the WarOutcome object that was computed previously
     * @param village the target village
     */
    export function applyWarOutcomeOnVillage ( outcome : WarOutcome, village : Village ) : void {
        // implement
    }
}