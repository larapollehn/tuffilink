import sqlAccess from "../dataaccess/SQLAccess";
import log from "../log/Logger";
import {url} from "../algorithms/UrlShortener";

const createURL = async (expressRequest, expressResponse) => {
    const originalUrl = expressRequest.body['original_url'];
    const username = expressRequest.user['username']
    const shortUrl = url.shortenLink(originalUrl + username);
    if (originalUrl && typeof originalUrl === 'string'){
        try{
            const createUrlResult = await sqlAccess.saveUrl(shortUrl, originalUrl, username);
            console.log(createUrlResult.rows);
            log.debug('Short url was saved');
            expressResponse.status(201).send('Url was created and saved');
        }catch (e) {
            log.debug('Url could not be saved');
            expressResponse.status(500).send(e.message)
        }
    } else {
        expressResponse.status(400).send('Url is missing');
    }
};

const getUsersUrls = (expressRequest, expressResponse) => {

};

const getOriginalUrl = (expressRequest, expressResponse) => {

};

const deleteUrl = (expressRequest, expressResponse) => {

};

export {
    createURL,
    getUsersUrls,
    getOriginalUrl,
    deleteUrl
};
