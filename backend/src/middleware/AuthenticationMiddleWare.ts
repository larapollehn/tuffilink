'use strict';

import {jwt} from "../algorithms/JWT";

export function protectedPath(req, res, next) {
    const token = req.headers["authorization"];
    if(token){
        try{
            req.user = jwt.getPayload(token.split(" ")[1]);
            next();
        } catch (e) {
            res.status(403).send(e.message);
        }
    }else{
        res.status(403).send("Bearer token missing");
    }
}