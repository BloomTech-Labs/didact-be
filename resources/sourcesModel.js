const db = require("../database/dbConfig.js");

module.exports = {
  get,
  getById,
  findByFilter,
  findByOwner,
  findByTag,
  add,
  update,
  del
};

function get() {
  return db("sources");
}

function getById(id) {
  return db("sources")
    .where({ id })
    .first();
}

function add(user_id, content) {
  return db("sources").insert({ creator_id: user_id, ...content });
}

function update(user, source_id, updates) {
  return db("sources")
    .where("sources.id", source_id)
    .then(source => {
      if (user.id === source.creator_id || user.admin || user.owner) {
        return db("sources")
          .where("sources.id", source_id)
          .update(updates);
      }
    });
}

function del(user, source_id) {
  return db("sources")
    .where("sources.id", source_id)
    .then(sources => {
      if (user.id === sources.creator_id || user.admin || user.owner) {
        return db("sources")
          .del()
          .where("sources.id", source_id);
      }
    });
}

function findByFilter(filter, query) {
  let queryTweak = query.toLowerCase();
  return db("sources").whereRaw(`LOWER(sources.${filter}) ~ ?`, [queryTweak]);
}

function findByTag(tag) {
  let tagTweak = tag.toLowerCase();
  return db("sources")
    .join("tags_sources", "tags_sources.article_id", "sources.id")
    .join("tags", "tags.id", "tags_sources.tag_id")
    .whereRaw("LOWER(tags.name) ~ ?", [tagTweak])
    .select("sources.*", "tags.name as tag")
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
      return db("sources")
        .join("users", "sources.creator_id", "users.id")
        .where("sources.creator_id", user.id)
        .select(
          "sources.*",
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
