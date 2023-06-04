import express, { Express } from "express";
import { findUser } from "../model/database";
import { VillageHandle, World } from "../model/objectwrappers";
import { Globals } from "../model/queries";

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