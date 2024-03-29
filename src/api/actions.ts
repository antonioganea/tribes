import express, { Express } from "express";
import { findUser } from "../model/database";
import { VillageHandle, World } from "../model/objectwrappers";
import { Globals } from "../model/queries";
import { Commands, CommandType } from "../model/commands";
import { BuildingType } from "../model/building";

export function setAppActionsMiddleware(app : any){

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
    
        let village = World.getVillage(<any>req.query.villageID);

        let pageData = village.getPageData();

        pageData["username"] = username;
    
        res.render("pages/village", pageData)
    
    })

    app.get('/building/cityhall', (req,res) => {
    
        let username : string = (<any>req.user).username;
    
        let village = World.getVillage(<any>req.query.villageID);

        let pageData = village.getPageData();

        pageData["username"] = username;
    
        res.render("pages/buildings/cityhall", pageData)
    
    })

    // todo : this is poorly written as an example and needs to be heavily guarded, cleaned, etc
    app.get('/building/upgrade/', (req,res) => {
        let villageID = parseInt(<any>req.query.villageID);
        let village = World.getVillage(villageID);

        if (village == null){ res.send("Village not found"); return }


        let buildingType = <any>req.query.type;

        //inverse lookup : for this : Building.GetType(string) => BuildingType

        let btype : BuildingType = BuildingType.CityHall;


        village.buildings.upgradeLevel(buildingType);

        res.redirect("/building/cityhall?villageID="+villageID)
    
        /*
        let time = 1000; //in seconds
        Commands.QueueUpgrade(time, village, btype);
    
        res.send(`Building lumberjack in ${village.getDBRow().name}! Command will be ready in ${time} seconds.`)
        */
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
    
        data["mapChunk"] = Globals.getMapChunk(0, 0, 8, 8)
        //data["mapChunk"] = [[],[],[],[], [],[],[],[]]
    
        res.render("pages/index", data);
        }
    );
}