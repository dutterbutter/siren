'use strict';

const logger = require('../logger/logger');
const v = require('./verification');

module.exports = (app) => {
  app.get('/webhook/', (req, res) => {
    logger.logInfo('/webhook/ GET');
    if (v.verification) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      logger.logError('failed validation');
      res.sendStatus(403);
    }
  });
};
