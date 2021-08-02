export enum MilitaryUnitType {
    Swordsman = "Swordsman",
    Axeman = "Axeman",
    Spearman = "Spearman",
    Archer = "Archer",
    Chivalry = "Chivalry",
    AdvChivalry = "AdvChivalry",
    Noble = "Noble"
}

export type MilitaryCollection = { [key in MilitaryUnitType]: number}

export function newMilitaryCollection() : MilitaryCollection{
    let obj: { [key : string]: number} = {}
    for (let item in MilitaryUnitType) {
        if (typeof (item) == "string") {
            //console.log(item);
            obj[item] = 0;
        }
    }
    //console.log(<MilitaryAssemble> obj);
    return <MilitaryCollection> obj
}

class MUData {
    constructor(readonly unitType: MilitaryUnitType, readonly damage: number, readonly capacity: number, readonly unitLongName: string){}
}

export const MilitaryUnitData : { [key in MilitaryUnitType]: MUData} = {
   [MilitaryUnitType.Swordsman]     :     new MUData(MilitaryUnitType.Swordsman, 5, 5, "Swordmsman"),
   [MilitaryUnitType.Axeman]        :     new MUData(MilitaryUnitType.Axeman, 5, 5, "Axeman"),
   [MilitaryUnitType.Spearman]      :     new MUData(MilitaryUnitType.Spearman, 5, 5, "Spearman"),
   [MilitaryUnitType.Archer]      :       new MUData(MilitaryUnitType.Archer, 5, 5, "Archer"),
   [MilitaryUnitType.Chivalry]      :     new MUData(MilitaryUnitType.Chivalry, 5, 5, "Chivalry"),
   [MilitaryUnitType.AdvChivalry]   :     new MUData(MilitaryUnitType.AdvChivalry, 5, 5, "Advanced Chivalry"),
   [MilitaryUnitType.Noble]   :           new MUData(MilitaryUnitType.Noble, 5, 5, "Noble"),
}