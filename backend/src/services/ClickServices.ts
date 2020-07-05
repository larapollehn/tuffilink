'use strict';

import sqlAccess from "../dataaccess/SQLAccess";
import log from "../log/Logger";
import queryConvert from "../utils/QueryConverter";

const getClickStatistic = async (expressRequest, expressResponse) => {
    log.debug("User want to get clicks statistic of following link");
    const link_id = expressRequest.query["link_id"];
    const days = expressRequest.query["days"];
    if(link_id && typeof link_id === "string" && days && typeof days === "string"){
        const linkInDatabase = await sqlAccess.getLink(expressRequest.user["id"], link_id);
        if(linkInDatabase.rows.length === 1) {
            const result = await sqlAccess.getDailyClickCount(link_id, Number(days));
            const queryResult = queryConvert(result);
            expressResponse.status(200).send(queryResult);
        }else{
            expressResponse.status(403).send("User is not the owner of the token and does not have access to the statistics");
        }
    }else{
        expressResponse.status(400).send("Please include the following queries: link_id, days");
    }
};

export {
    getClickStatistic
};