// Types of commands

// one time:
// update building
// attack
// trade

enum CommandType{
    buildLumberjack,
    buildMine,
    buildWall,
    trainTroops,
    attackVillage
}
  
namespace Command{
    export function Add(time : number, commandType : CommandType, optionalParameters : any) : void {
        // logica
    }

    export function GetCommandsForVillage( villageID: number ) {

    }
}
/*
app.get('/buildLumberjack', (req,res) => {
    let villageID = parseInt(<any>req.query.villageID)
    let village = World.getVillage(villageID)

    let time = 1000; //in seconds
    Command.Add(time, CommandType.buildLumberjack, {})

    let village = World.getVillage(villageID)

    res.send(`Building lumberjack in ${village.name}! Command will be ready in ${time} seconds.`)
})
*/