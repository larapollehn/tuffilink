const express = require('express');
import {
    createURL,
    getOriginalUrl,
    getUsersUrls,
    deleteUrl} from "../services/UrlServices";

const urlRouter = express.Router();

urlRouter.get('/', getUsersUrls);
urlRouter.post('/', createURL);
urlRouter.get('/original/:shorturl', getOriginalUrl);
urlRouter.delete('/:url_id', deleteUrl);



export default urlRouter;