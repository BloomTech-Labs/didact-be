const addTextChannelToCategory = (message, categoryName, pathName) => {
  //don't create category channel, just add text channel to category channel
  //by first finding the id of category channel and then using create(name, {options})
  const categoryID = message.guild.channels.cache
    .filter(
      channel => channel.type === "category" && channel.name === categoryName
    )
    .first().id;
  message.guild.channels.create(pathName, {
    type: "text",
    parent: categoryID
  });
};

const addCategoryAndTextChannel = (message, categoryName, pathName) => {
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
};

module.exports = {
  addTextChannelToCategory,
  addCategoryAndTextChannel
};
