'use strict';

import sqlAccess from "../dataaccess/SQLAccess";
import log from "../log/Logger";

const getClickStatistic = async (expressRequest, expressResponse) => {
    log.debug("User want to get clicks statistic of following link");
};

export {
    getClickStatistic
};