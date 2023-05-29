const { Api,TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { validationResult,body } = require('express-validator');
// const Tutorial = require("../models/tutorial.model.js");
const input = require("input"); // npm i input

const apiId = 20010202;
const apiHash = "6ce39be71a3e47bd94fd284bddd80ab9";
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjE3MgG7BRJhbXotwVF1OSbbqup8oRNFbzGVMidIJ+kt08YxG8CnTr8XtVJlVTgG5m9zu6ai42dIsmmgvVgQUqsInZHdTxFRRbAIJeIqHC6jxLwqhpYtez1liX15XHXMdpcopAbm/slJgF/C2+3kt//w5tZEBuhSGEH/XmPKnOUVLSLXVE9bEicE43ufFKYgv9Vk0HeysKcUGzn310IluccWvkQsTkZh0wM7AcU27/byU0S/I+swToO0fL6gvKZB8n1FP2nY51lycL0CvDp4kT+jMJub+58JuCSRhf18LHs0byx1vNIFX8IKNQrmF1KaDyZh6VgBD/gaG3hk4QBZgK7ACA7nmg=="); // fill this later with the value from session.save()

// Create and Save a new Tutorial
exports.createChannel = (req, res, next) => {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
      (async () => {
        console.log("Loading interactive example...");
        const client = new TelegramClient(stringSession, apiId, apiHash, {
          connectionRetries: 5,
          useWSS:true
        });
      
        await client.start({
          phoneNumber: async () => await input.text("number ?"),
          password: async () => await input.text("password?"),
          phoneCode: async () => await input.text("Code ?"),
          onError: (err) => console.log(err),
        });
      
        console.log("You should now be connected.");
        
        //Create A Channel
        const result = await client.invoke(
            new Api.channels.CreateChannel({
              title: req.body.name,
              about: req.body.description,
              broadcast : false,
              forImport: false,
              geoPoint: new Api.InputGeoPoint({
                lat: 8.24,
                long: 8.24,
                accuracyRadius: 43,
              }),
              address: "",
            })
          );
          console.log(result); // prints the result
          res.send({status:"success"})
      })();
    }
 } catch(err) {
   return next(err)
 }
};

// Create and Save a new Tutorial
exports.sendMsgChannel = (req, res, next) => {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
      (async () => {
        console.log("Loading interactive example...");
        const client = new TelegramClient(stringSession, apiId, apiHash, {
          connectionRetries: 5,
          useWSS:true
        });
      
        await client.start({
          phoneNumber: async () => await input.text("number ?"),
          password: async () => await input.text("password?"),
          phoneCode: async () => await input.text("Code ?"),
          onError: (err) => console.log(err),
        });
      
        console.log("You should now be connected.");
        
        //Create A Channel
        await client.connect(); // This assumes you have already authenticated with .start()

        await client.sendMessage(req.body.username, { message: req.body.message });

        // console.log(result); // prints the result
          res.send({status:"success"})
      })();
    }
 } catch(err) {
   return next(err)
 }
};

// Create and Save a new Tutorial
exports.replyMsgChannel = (req, res, next) => {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
      (async () => {
        console.log("Loading interactive example...");
        const client = new TelegramClient(stringSession, apiId, apiHash, {
          connectionRetries: 5,
          useWSS:true
        });
      
        await client.start({
          phoneNumber: async () => await input.text("number ?"),
          password: async () => await input.text("password?"),
          phoneCode: async () => await input.text("Code ?"),
          onError: (err) => console.log(err),
        });
      
        console.log("You should now be connected.");
        
        //Create A Channel
        await client.connect(); // This assumes you have already authenticated with .start()

        await client.sendMessage(req.body.username, 
        { 
          message: req.body.message,
          replyTo: req.body.replyMsgId
        });

        res.send({status:"success"})
      })();
    }
 } catch(err) {
   return next(err)
 }
};

// Retrieve all Message History
exports.getMessage = (req, res) => {

  let data = [];

  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
      (async function run() {

        const client = new TelegramClient(stringSession, apiId, apiHash, {
          connectionRetries: 5,
          useWSS:true
        });
        await client.connect(); // This assumes you have already authenticated with .start()
    
        const channelUsername = req.body.username; // Replace with the username of the channel you want to get the history of
      
        const entity = await client.getEntity(channelUsername);
    
        const messages = await client.getMessages(entity, {offset: req.body.offset, limit: req.body.limit});

        console.log(messages);
    
        messages.forEach(element => {
          const date = new Date(element.date * 1000); // Convert the timestamp to milliseconds and create a new Date object
          const formattedDate = date.toISOString().slice(0, 19).replace('T', ' '); // Format the date as a MySQL date string

          data.push({
            "id": element.id,
            "message" : element.message,
            "datetime" : formattedDate,
            "replyToMsgId" : (element.replyTo != null) ? element.replyTo.replyToMsgId : null
          })
        });

        (req.body.hasOwnProperty('dev') && req.body.dev == true) ? res.send(messages) : res.send(data); 
      })();
    }
 } catch(err) {
   return next(err)
 }


};

// Retrieve all Message History
exports.getChat = (req, res) => {
  (async function run() {

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
      useWSS:true
    });
    await client.connect(); // This assumes you have already authenticated with .start()
   
    // Get all your chats
    // const chats = await client.getChats();
    const result = await client.invoke(
      new Api.messages.GetChats({
        id: [BigInt("-4156887774564")],
      })
    );
    console.log(result);

    res.send(result);
  })();
};

// Resolve Username 
exports.resolveUsername = (req, res) => {

  (async function run() {

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
      useWSS:true
    });
    await client.connect(); // This assumes you have already authenticated with .start()

    const result = await client.invoke(
      new Api.contacts.ResolveUsername({
        username: "arexdyn",
      })
    );
    res.send(result)
    console.log(result); // prints the result
  })();

};

exports.validate = (method) => {
  switch (method) {
    case "createChannel":
      return [ 
        body('name', 'No Name').exists(),
        body('description', 'No Description').exists(),
       ] 
      break;

      case "sendMsgChannel":
        return [ 
          body('username', 'Please Fill Username').exists(),
          body('message', 'Please Fill Message').exists(),
         ] 
        break;

      case "replyMsgChannel":
        return [ 
          body('username', 'Please Fill Username').exists(),
          body('message', 'Please Fill Message').exists(),
          body('replyMsgId', 'Please Fill Reply Message ID').exists(),
          ] 
        break;

      case "getMessage":
        return [ 
          body('username', 'Please Fill Username').exists(),
          body('offset', 'Please Fill Offset').exists(),
          body('limit', 'Please Fill Limit').exists(),
          ] 
        break;
        
  
    default:
      break;
  }
}