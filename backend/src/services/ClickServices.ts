'use strict';

import sqlAccess from "../dataaccess/SQLAccess";
import log from "../log/Logger";
import queryConvert from "../utils/QueryConverter";

const getClickStatistic = async (expressRequest, expressResponse) => {
    log.debug("User want to get clicks statistic of following link");
    const link_id = expressRequest.query["link_id"];
    if(link_id && typeof link_id === "string"){
        const result = await sqlAccess.getDailyClickCount(link_id);
        const queryResult = queryConvert(result.rows);
        expressResponse.status(200).send(queryResult);
    }else{
        expressResponse.status(400).send("Please include the following queries: link_id");
    }
};

export {
    getClickStatistic
};