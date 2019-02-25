'use strict';
/*eslint-disable */
const express = require('express');
const mongoose = require('mongoose');
const ReminderModel = require('./data/model/reminder');
const logger = require('./logger/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/routes')(app);

const MONGO_CONNECTION_STRING = 'mongodb://localhost:27017/data';
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.on('open', () => {
  logger.logInfo('connected to mongo...');
  app.listen(PORT, _ => {
    logger.logInfo(`server listening on ${PORT}`);
  });
});

