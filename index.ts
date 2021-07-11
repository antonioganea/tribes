import express from 'express';

import {findUser, insertUser} from './src/database';

import { WorldPosition } from './src/utils';
import { newMilitaryCollection, MilitaryCollection, MilitaryUnitData, MilitaryUnitType } from './src/militaryunit';
import { User } from './src/user';
import { Globals } from './src/queries';

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



// PASSPORT JS PART
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

passport.serializeUser(function(user :any, done :any) {
  //console.log("serialization")
  //console.log(JSON.stringify(user))
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user :any, done :any) {
  //console.log("Deserialization")
  //console.log(user)
  done(null, JSON.parse(user)); // TODO : handle deserialization if parsing fails ( weird cookie input )
});

app.use(cookieParser('secret'));
app.use(cookieSession({signed:false}));
app.use(session({ secret: 'anything' }));

app.use(require('body-parser').urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static('public'))

passport.use(new Strategy(
  function(username : any, password : any, cb : any) {
    findUser(username, function(err : any, user : any) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'})
);

app.get('/login', (req,res) => {
  let data = {
    formButtonName: "Login",
    username: null
  }
  res.render("pages/login", data)
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/register', (req, res) => {
  let data = {
    formButtonName: "Register",
    username: null
  }
  res.render("pages/register", data);
})

app.post('/register', (req, res) => {
  insertUser(req.body.username, req.body.email, req.body.password);
  res.redirect('/');
})


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
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});