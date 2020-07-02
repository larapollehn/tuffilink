const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
import log from './src/log/Logger';
import urlRouter from './src/routes/UrlRoutes';
import userRouter from './src/routes/UserRoutes';
import sqlAccess from './src/data/SQLAccess';

function initialize() {
    log.debug("Start initializing database")
    const files = fs.readdirSync('scripts');
    files.sort();
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join("scripts", files[i]);
        log.debug("Initialize current file ", filePath)
        fs.readFile(filePath, {encoding: 'utf-8'},  (err, data) => {
            if (err) {
                throw err;
            } else {
                sqlAccess.query(data, (error, result) => {
                    log.debug("Migrated successfully file ", filePath);
                    if(error){
                        throw error;
                    }
                });
            }
        });
    }
}
initialize();


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/url', urlRouter);
app.use('/user', userRouter);

export default app;
