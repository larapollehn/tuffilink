const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs').promises;
const path = require('path');
import log from './src/log/Logger';
import urlRouter from './src/routes/UrlRoutes';
import userRouter from './src/routes/UserRoutes';
import redirectRouter from "./src/routes/RedirectRoutes";
import clickRouter from "./src/routes/ClickRoutes";
import sqlAccess from './src/dataaccess/SQLAccess';

async function initialize() {
    log.debug("Start initializing database")
    const files = await fs.readdir('scripts');
    files.sort();
    try {
        sqlAccess.begin();
        for (let i = 0; i < files.length; i++) {
            const filePath = path.join("scripts", files[i]);
            log.debug("Initialize current file ", filePath)
            const data = await fs.readFile(filePath, "utf-8");
            await sqlAccess.initialize(data);
            log.debug("Migrated successfully file ", filePath);
        }
        sqlAccess.commit();
    } catch (e) {
        sqlAccess.rollback();
        log.debug('Files could not be migrated', e.message);
        throw e;
    }
}

initialize();


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/url', urlRouter);
app.use('/user', userRouter);
app.use('/click', clickRouter);
app.use('/', redirectRouter);

export default app;
