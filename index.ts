import express from 'express';
import { Globals } from './src/model/queries';
import { setAppPassportMiddleware } from './src/api/login';
import { setAppActionsMiddleware } from './src/api/actions';

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

//console.log(Globals.getMapChunk(499,499,5,5))

const app = express();
const PORT = 80;

app.use(express.static('public'))

setAppPassportMiddleware(app);
setAppActionsMiddleware(app);


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});