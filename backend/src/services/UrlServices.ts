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


const getUsersUrls =  async (expressRequest, expressResponse) => {
    const username = expressRequest.user['username'];
    const userid = expressRequest.user['id'];
    const requestedUserId = expressRequest.query.user_id;
    const pageSize = expressRequest.query.page_size;
    const pageNumber = expressRequest.query.page_number;

    if (username && typeof username === 'string' &&
        userid && typeof userid === 'number' &&
        requestedUserId && typeof requestedUserId === 'string' &&
        pageSize && typeof pageSize === 'string' &&
        pageNumber && typeof pageNumber === 'string'){

        if (String(userid) === requestedUserId){
            log.debug('User is authorized to get urls');
            const getUsersUrlsResult = await sqlAccess.getUsersUrls(userid, pageNumber, pageSize);
            const urls = [];
            for (let i = 0; i < getUsersUrlsResult.rows.length; i++){
                const url = {};
                for(let j = 0; j < getUsersUrlsResult.fields.length; j++){
                    url[getUsersUrlsResult.fields[j].name] = getUsersUrlsResult.rows[i][j];
                }
                urls.push(url);
            }
            expressResponse.status(200).send(urls);
        } else {
            expressResponse.status(403).send('User not authorized');
            return;
        }
    } else {
        expressResponse.status(400).send('Missing data or wrong type');
    }
};

const getUserUrlsCount = async (expressRequest, expressResponse) => {
    const username = expressRequest.user['username'];
    const userid = expressRequest.user['id'];
    const requestedUserId = expressRequest.query.user_id;
    log.debug('User url count requested with:', username, userid, requestedUserId);

    if(username && typeof username === 'string' && userid && typeof userid === 'number' && requestedUserId && typeof requestedUserId === 'string'){
        if (String(userid) === requestedUserId){
            const getUrlCountResult = await sqlAccess.urlCount(userid);
            log.debug(getUrlCountResult.rows);
            expressResponse.status(200).send(getUrlCountResult.rows[0][0]);
        } else {
            expressResponse.status(403).send('User not authorized');
            return;
        }
    } else {
        expressResponse.status(400).send('Missing data or wrong type');
    }

};

const deleteUrl = (expressRequest, expressResponse) => {

};

export {
    createURL,
    getUsersUrls,
    getUserUrlsCount,
    deleteUrl
};
