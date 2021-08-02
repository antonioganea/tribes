import express from "express";
import { findUser } from "../model/database";
import { Globals } from "../model/queries";
import { User } from "../model/user";

export function setAppActionsMiddleware(app : express.Express){

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
}