const express = require('express');
import {
    getClickStatistic,
} from "../services/ClickServices";

import {protectedPath} from "../middleware/AuthenticationMiddleWare";

const clickRouter = express.Router();

clickRouter.get('/', protectedPath, getClickStatistic);

export default clickRouter;