'use strict';

const logger = require('../logger/logger');
const v = require('./verification');
const msg = require('../core/messaging');

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
  app.post('/webhook/', function(req, res) {
    logger.logInfo('/webhook/ POST');
    let data = req.body;
    if (data.object === 'page') {
      data.entry.forEach((entry) => {
        entry.messaging.forEach((msgEvent) => {
          if (msgEvent.message) {
            msg.receivedMsg(msgEvent);
          } else if (msgEvent.postback) {
            msg.receivedPostback(msgEvent);
          } else {
            logger.logError(`unknown event ${msgEvent}`);
          }
        });
      });
      res.sendStatus(200);
    }
  });
};


