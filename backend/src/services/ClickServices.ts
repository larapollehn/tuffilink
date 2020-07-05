'use strict';

import sqlAccess from "../dataaccess/SQLAccess";
import log from "../log/Logger";
import queryConvert from "../utils/QueryConverter";

const getClickStatistic = async (expressRequest, expressResponse) => {
    log.debug("User want to get clicks statistic of following link");
    const link_id = expressRequest.query["link_id"];
    const days = expressRequest.query["days"];
    if(link_id && typeof link_id === "string" && days && typeof days === "string"){
        const result = await sqlAccess.getDailyClickCount(link_id, Number(days));
        const queryResult = queryConvert(result);
        expressResponse.status(200).send(queryResult);
    }else{
        expressResponse.status(400).send("Please include the following queries: link_id, days");
    }
};

export {
    getClickStatistic
};