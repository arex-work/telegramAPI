const express = require("express");
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const cors = require("cors");

const app = express();

const { Api,TelegramClient, utils } = require("telegram");
const { StringSession,StoreSession } = require("telegram/sessions");

const apiId = 20010202;
const apiHash = "6ce39be71a3e47bd94fd284bddd80ab9";
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjE3MgG7BRJhbXotwVF1OSbbqup8oRNFbzGVMidIJ+kt08YxG8CnTr8XtVJlVTgG5m9zu6ai42dIsmmgvVgQUqsInZHdTxFRRbAIJeIqHC6jxLwqhpYtez1liX15XHXMdpcopAbm/slJgF/C2+3kt//w5tZEBuhSGEH/XmPKnOUVLSLXVE9bEicE43ufFKYgv9Vk0HeysKcUGzn310IluccWvkQsTkZh0wM7AcU27/byU0S/I+swToO0fL6gvKZB8n1FP2nY51lycL0CvDp4kT+jMJub+58JuCSRhf18LHs0byx1vNIFX8IKNQrmF1KaDyZh6VgBD/gaG3hk4QBZgK7ACA7nmg=="); // fill this later with the value from session.save()

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
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
    console.log(client.session.save()); // Save this string to avoid logging in again
    await client.sendMessage("me", { message: "Hello!" });
  
  })();
});

require("./app/routes/telegram.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
