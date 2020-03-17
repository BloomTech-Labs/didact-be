// require the discord.js module
const Discord = require("discord.js");

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Discord connected");
});

client.on("message", message => {
  const createChannel = "!birth";
  if (message.content.startsWith(createChannel)) {
    const messageString = message.content
      .slice(createChannel.length)
      .toLowerCase();
    const stringSlice = messageString.search("###");
    const pathTopic = messageString.slice(stringSlice + 3).trim();
    const pathName = messageString
      .slice(0, stringSlice)
      .split(/[\W\s\.]/)
      .join("-");
    console.log(`Path name: ${pathName} Path topic: ${pathTopic}`);
    message.channel.send(`Path name: ${pathName} Path topic: ${pathTopic}`);
  }
});

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);

//fetching webhook to issue out commands to general text channel

module.exports = client;
