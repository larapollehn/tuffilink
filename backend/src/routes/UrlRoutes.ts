const express = require('express');
import {
    createURL,
    getUserUrlsCount,
    getUsersUrls,
    deleteUrl
} from "../services/UrlServices";
import {protectedPath} from "../middleware/AuthenticationMiddleWare";

const urlRouter = express.Router();

urlRouter.get('/', protectedPath, getUsersUrls);
urlRouter.post('/', protectedPath, createURL);
urlRouter.get('/count', protectedPath, getUserUrlsCount);
urlRouter.delete('/:url_id', protectedPath, deleteUrl);


export default urlRouter;