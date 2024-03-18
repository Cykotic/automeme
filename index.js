const {
    Client,
    GatewayIntentBits,
} = require('discord.js');
const {
    sendMemeToChannel
} = require("./utils");

require('dotenv').config();

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)]
});

client.on('ready', async () => {

    setInterval(() => {
        sendMemeToChannel(process.env.READY_URL);
        console.log("Bot Ready!")
    }, 86400000); // send every 24 hrs (it's in ms)
});

client.login(process.env.token);