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

    console.log(`Path name: ${pathName} Path topic: ${categoryName}`);
    //this if statement checks if the category channel exists AND if the text channel does NOT exist
    if (
      message.guild.channels.cache
        .filter(channel => channel.type === "category")
        .some(channel => channel.name === categoryName) &&
      !message.guild.channels.cache
        .filter(channel => channel.type === "text")
        .some(channel => channel.name === pathName)
    ) {
      //don't create topic, just add channel to topic category
      //by first finding the id of category and then using create(name, {options})
      const categoryID = message.guild.channels.cache
        .filter(
          channel =>
            channel.type === "category" && channel.name === categoryName
        )
        .first().id;
      message.guild.channels.create(pathName, {
        type: "text",
        parent: categoryID
      });
    }
    //this if statement checks if the category channel does not exist AND if the text channel does NOT exist
    else if (
      !message.guild.channels.cache
        .filter(channel => channel.type === "category")
        .some(channel => channel.name === categoryName) &&
      !message.guild.channels.cache
        .filter(channel => channel.type === "text")
        .some(channel => channel.name === pathName)
    ) {
      //creates a new category channel
      message.guild.channels
        .create(categoryName, {
          type: "category"
        })
        .then(channel => {
          //grabbing the new category channel id
          const categoryID = message.guild.channels.cache
            .filter(
              channel =>
                channel.type === "category" && channel.name === categoryName
            )
            .first().id;
          //once new category channel is created, we create a text channel as a child to it
          message.guild.channels.create(pathName, {
            type: "text",
            parent: categoryID
          });
        })
        .catch(err => console.log(err));
    } else {
      console.log("text channel already exists, no double channels");
      return;
    }
  }
});

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);

//fetching webhook to issue out commands to general text channel

module.exports = client;
