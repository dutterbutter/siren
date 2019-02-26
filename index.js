'use strict';
/*eslint-disable */
const express = require('express');
const mongoose = require('mongoose');
const ReminderModel = require('./data/model/reminder');
const logger = require('./logger/logger');
const s = require('./worker/scheduler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/routes')(app);

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/data';

s.schedulerFactory.start();

const options = {
    autoIndex: false,
    reconnectTries: 30,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true
};

const connectWithRetry = () => {
    logger.logInfo('mongoDB connection with retry...');
    mongoose.connect(MONGO_CONNECTION_STRING, options).then(()=>{
        logger.logInfo('connected to mongo...');
    }).catch(err =>{
        logger.logError('MongoDB connection unsuccessful, retry after 5 seconds.', err);
        setTimeout(connectWithRetry, 5000)
    })
};

app.listen(PORT, _ => {
    logger.logInfo(`server listening on ${PORT}`);
});

connectWithRetry();
