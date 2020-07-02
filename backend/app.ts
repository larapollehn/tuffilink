const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
import indexRouter from './src/routes';
import userRouter from './src/routes/users';
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', userRouter);

export default app;
