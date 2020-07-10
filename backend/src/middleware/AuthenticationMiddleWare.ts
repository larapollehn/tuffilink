'use strict';

import {jwt} from "../algorithms/JWT";

/**
 * The provided JWT Token in the authorization header is split
 * user information in form of payload of token is returned
 * @param req
 * @param res
 * @param next
 */
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
