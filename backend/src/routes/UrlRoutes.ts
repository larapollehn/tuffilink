const express = require('express');
import {
    createURL,
    getOriginalUrl,
    getUsersUrls,
    deleteUrl
} from "../services/UrlServices";
import {protectedPath} from "../middleware/AuthenticationMiddleWare";

const urlRouter = express.Router();

urlRouter.get('/', protectedPath, getUsersUrls);
urlRouter.post('/', protectedPath, createURL);
urlRouter.delete('/:url_id', protectedPath, deleteUrl);
urlRouter.get('/original/:shorturl', getOriginalUrl);


export default urlRouter;