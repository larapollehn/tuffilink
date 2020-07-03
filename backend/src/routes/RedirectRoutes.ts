'use strict';

const express = require('express');
import {redirectToFrontend, redirectToOriginalUrl} from "../services/RedirectServices";

const redirectRouter = express.Router();

redirectRouter.get('/', redirectToFrontend);
redirectRouter.get('/:url', redirectToOriginalUrl);

export default redirectRouter;