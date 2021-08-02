import express from 'express';

import {findUser, insertUser} from './src/model/database';

import { WorldPosition } from './src/model/utils';
import { newMilitaryCollection, MilitaryCollection, MilitaryUnitData, MilitaryUnitType } from './src/model/militaryunit';
import { User } from './src/model/user';
import { Globals } from './src/model/queries';
import { setAppPassportMiddleware } from './src/api/login';

/*
let user: User = new User("antonio");

let village : Village = Village.createVillage("Valea Regilor", new WorldPosition(500, 500), user);
console.log(village);

let world : World =  new World();

world.registerVillage(village);
world.addForest(502,500);
world.addForest(502,501);
world.addForest(502,502);

console.log(world.getMapChunk(499, 499, 3, 3));
*/

//Village.createVillage(2,"Valea Boilor2", 502,501);

/*
console.log("Checking positions");
console.log(World.isPositionOccupied(501,501))
console.log(World.isPositionOccupied(510,505))
*/

console.log(Globals.getMapChunk(499,499,5,5))

// rest of the code remains same
const app = express();
const PORT = 80;

app.use(express.static('public'))

setAppPassportMiddleware(app);



// render the profile of an user
app.get('/profile/:user/', (req,res) => {

  let username = req.params["user"]

  findUser(username, (err: any, row: any) => {
    console.log(row);
  
    let pageData = {
      profileData: row,
      userVillages : Globals.getUserVillages(row.userID)
    };
  
    res.render("pages/profile", pageData)
  })

})

app.get('/village', (req,res) => {

  let username : string = (<any>req.user).username;

  let village = Globals.getVillage(parseInt(<any>req.query.villageID))

  let pageData = {
    username : username,
    villageData : village,
    military : Globals.getVillageMilitary(village.villageID),
    buildings: Globals.getVillageBuildings(village.villageID),
    resources: Globals.getVillageResources(village.villageID),
    owner : User.getUserWithID(village.userID)
    //resources : resources
  };

  res.render("pages/village", pageData)

})

app.get('/', (req, res) => {
    let data : any = {};

    if ( req.user ){
      data = {
        username: (<any>req.user).username,
      }
    } else {
      data = {
        username: null,
      }
    }

    data["mapChunk"] = Globals.getMapChunk(499, 499, 8, 8)
    //data["mapChunk"] = [[],[],[],[], [],[],[],[]]

    res.render("pages/index", data);
  }
);
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});