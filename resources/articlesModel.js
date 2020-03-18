const db = require("../database/dbConfig.js");

module.exports = {
  get,
  getById,
  findByTag,
  findByOwner,
  findByFilter,
  add,
  update,
  del
};

async function get() {
  return db("articles")
    .join("users", "users.id", "articles.creator_id")
    .select("users.first_name", "users.last_name", "articles.*");
}

function getById(id) {
  return db("articles")
    .join("users", "users.id", "articles.creator_id")
    .select("users.first_name", "users.last_name", "articles.*")
    .where("articles.id", id)
    .first();
}

function add(user_id, content) {
  return db("articles").insert({ creator_id: user_id, ...content });
}

function update(user, article_id, updates) {
  return db("articles")
    .where("articles.id", article_id)
    .then(article => {
      if (user.id === article.creator_id || user.admin || user.owner) {
        return db("articles")
          .where("articles.id", article_id)
          .update(updates);
      }
    });
}

function del(user, article_id) {
  return db("articles")
    .where("articles.id", article_id)
    .then(article => {
      if (user.id === article.creator_id || user.admin || user.owner) {
        return db("articles")
          .del()
          .where("articles.id", article_id);
      }
    });
}

function findByFilter(filter, query) {
  let queryTweak = query.toLowerCase();
  return db("articles").whereRaw(`LOWER(articles.${filter}) ~ ?`, [queryTweak]);
}

function findByTag(tag) {
  let tagTweak = tag.toLowerCase();
  return db("articles")
    .join("tags_articles", "tags_articles.article_id", "articles.id")
    .join("tags", "tags.id", "tags_articles.tag_id")
    .whereRaw("LOWER(tags.name) ~ ?", [tagTweak])
    .select("articles.*", "tags.name as tag")
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
      return db("articles")
        .join("users", "articles.creator_id", "users.id")
        .where("articles.creator_id", user.id)
        .select(
          "articles.*",
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
