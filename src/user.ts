import { db } from "./database";

export namespace User{
    
    let findUserStmt = db.prepare(`SELECT * FROM users WHERE userID=? LIMIT 1;`);
    export function getUserWithID( userID : number ) : any {
        return findUserStmt.get(userID);
    }
    
}