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
  if (
    message.content.startsWith(createChannel) &&
    message.author.hasPermission()
  ) {
    const pathName = message.content
      .slice(createChannel.length)
      .split(/[\W\s\.]/)
      .join("-")
      .toLowerCase();
    //fetch guild and use .channels.create() to make new channel
  }
});

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);

//fetching webhook to issue out commands to general text channel

module.exports = client;
