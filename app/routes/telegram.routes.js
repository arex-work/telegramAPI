module.exports = app => {
  const telegram = require("../controllers/telegram.controller.js");

  var router = require("express").Router();

  // Create A Channel
  router.post('/newChannel',telegram.validate('createChannel'),telegram.createChannel,)

  // Send Message
  router.post('/sendMsgChannel',telegram.validate('sendMsgChannel'),telegram.sendMsgChannel,)

  // Reply Message
  router.post('/replyMsgChannel',telegram.validate('replyMsgChannel'),telegram.replyMsgChannel,)

  // Retrieve all Messages
  router.get("/getMessage", telegram.validate('getMessage'),telegram.getMessage
  );

  // Retrieve all Chat
  router.get("/getChat", telegram.getChat);

  // Resolve Username
  router.get("/resolveUsername", telegram.resolveUsername);

  app.use('/api/telegram', router);
};