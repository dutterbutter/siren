'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/routes')(app);

app.listen(PORT, _ => {
  logger.logInfo(`server listening on ${PORT}`);
});

