'use strict';
const verification = (req) => {
  if (req.query['hub.mode'] !== 'subscribe' &&
      req.query['hub.verify_token'] !== process.env.FB_VERIFY_TOKEN
  ){ return false; }
};

module.exports.verification = verification;
