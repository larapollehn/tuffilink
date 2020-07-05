'use strict';

import sqlAccess from "../dataaccess/SQLAccess";
import log from "../log/Logger";

const redirectToOriginalUrl = async (expressRequest, expressResponse) => {
    const url = expressRequest.params["url"];
    log.debug("Original url requested for short url", url);
    try {
        const getOriginalUrlResult = await sqlAccess.getOriginalUrl(url);
        try {
            log.debug("Creating new click for short url", url);
            await sqlAccess.createClick(url);
        } catch (e) {
            log.error("Error creating a click for short url", url);
        }
        log.debug("Original url", getOriginalUrlResult.rows[0][0]);
        expressResponse.redirect(getOriginalUrlResult.rows[0][0]);
    } catch (e) {
        log.debug(e.stack);
        expressResponse.redirect("https://tinylink.larapollehn.de/ui/404");
    }
};

const redirectToFrontend = (expressRequest, expressResponse) => {
    expressResponse.redirect("https://tinylink.larapollehn.de/ui/");
};

export {
    redirectToOriginalUrl,
    redirectToFrontend
};
