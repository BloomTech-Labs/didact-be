const {
  addTextChannelToCategory,
  addCategoryAndTextChannel
} = require("./didactFunctions");

// require the discord.js module
const Discord = require("discord.js");

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Discord connected");
});

client.on("message", async message => {
  if (
    message.author.username === "Manager Bot" ||
    message.member.roles.cache.some(item => item.name === "Owner") ||
    message.member.roles.cache.some(item => item.name === "Admin")
  ) {
    const createChannel = "!birth";
    if (message.content.startsWith(createChannel)) {
      const messageString = message.content
        .slice(createChannel.length)
        .toLowerCase();
      const stringSlice = messageString.search("###");
      //category names can have spaces and will generally be one or two words on didact with no special characters
      const categoryName = messageString.slice(stringSlice + 3).trim();
      const pathName = messageString
        .slice(0, stringSlice)
        .trim()
        //splitting pathname at all non-alphanumerical characters, spaces, and periods (for discord channel names,
        //convention is hyphenated separation and lower case)
        .split(/[\W\s\.]/)
        .join("-");

      //this if statement checks if the category channel exists AND if the text channel does NOT exist
      if (
        message.guild.channels.cache
          .filter(channel => channel.type === "category")
          .some(channel => channel.name === categoryName) &&
        !message.guild.channels.cache
          .filter(channel => channel.type === "text")
          .some(channel => channel.name === pathName)
      ) {
        addTextChannelToCategory(message, categoryName, pathName);

        //this if statement checks if the category channel does not exist AND if the text channel does NOT exist
      } else if (
        !message.guild.channels.cache
          .filter(channel => channel.type === "category")
          .some(channel => channel.name === categoryName) &&
        !message.guild.channels.cache
          .filter(channel => channel.type === "text")
          .some(channel => channel.name === pathName)
      ) {
        addCategoryAndTextChannel(message, categoryName, pathName);
      } else {
        console.log("text channel already exists, no double channels");
        return;
      }
    }
  } else {
    console.log("Not an admin or owner.");
  }
});

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);

//fetching webhook to issue out commands to general text channel

module.exports = client;
