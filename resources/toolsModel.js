const db = require("../database/dbConfig.js");

module.exports = {
  get,
  getById,
  findByFilter,
  findByOwner,
  findByTag,
  add,
  update,
  del,
  editToolImage
};

function get() {
  return db("tools");
}

function getById(id) {
  return db("tools")
    .where({ id })
    .first();
}

function add(user_id, content) {
  return db("tools").insert({ creator_id: user_id, ...content });
}

function update(user, tool_id, updates) {
  return db("tools")
    .where("tools.id", tool_id)
    .then(tool => {
      if (user.id === tool.creator_id || user.admin || user.owner) {
        return db("tools")
          .where("tools.id", tool_id)
          .update(updates);
      }
    });
}

function del(user, tool_id) {
  return db("tools")
    .where("tools.id", tool_id)
    .then(tool => {
      if (user.id === tool.creator_id || user.admin || user.owner) {
        return db("tools")
          .del()
          .where("tools.id", tool_id);
      }
    });
}

function findByFilter(filter, query) {
  let queryTweak = query.toLowerCase();
  if (filter === "title") {
    filter = "name";
  }
  return db("tools").whereRaw(`LOWER(tools.${filter}) ~ ?`, [queryTweak]);
}

function findByTag(tag) {
  let tagTweak = tag.toLowerCase();
  return db("tools")
    .join("tags_tools", "tags_tools.tool_id", "tools.id")
    .join("tags", "tags.id", "tags_tools.tag_id")
    .whereRaw("LOWER(tags.name) ~ ?", [tagTweak])
    .select("tools.*", "tags.name as tag")
    .then(result => {
      return result;
    });
}

async function findByOwner(name) {
  let nameTweak = name.toLowerCase();
  //looks for users using search input value, checks many possible case sensitivities
  let users = db(
    "users"
  ).orWhereRaw("LOWER(first_name || ' ' || last_name) ~ ?", [nameTweak]);
  //inserts users into function and awaits result
  return await findForUsers(users);
}

async function findForUsers(users) {
  return users
    .map(async user => {
      return db("tools")
        .join("users", "tools.creator_id", "users.id")
        .where("tools.creator_id", user.id)
        .select(
          "tools.*",
          "users.first_name as creator_first_name",
          "users.last_name as creator_last_name"
        );
    })
    .then(result => {
      //flattening nested array return
      let flattenedArray = result.flatMap(arr => arr);
      return flattenedArray;
    });
}

function editToolImage(imageData, toolId) {
  return db("tools")
    .where("id", "=", toolId)
    .update({ image: imageData })
    .then(success => {
      return getById(toolId);
    })
    .catch(err => {
      console.log("Something went wrong", err);
    });
}
