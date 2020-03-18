module.exports = {
  get,
  getById,
  add,
  update,
  del
};

function get() {
  return db("external_articles");
}
function getById(id) {
  return db("external_articles")
    .where({ id })
    .first();
}
function add(user_id, content) {
  return db("external_articles").insert({ creator_id: user_id, ...content });
}

function update(user, external_article_id, updates) {
  return db("external_articles")
    .where("external_articles.id", external_article_id)
    .then(external_article => {
      if (user.id === external_article.creator_id || user.admin || user.owner) {
        return db("external_articles")
          .where("external_articles.id", external_article_id)
          .update(updates);
      }
    });
}
function del(user, external_article_id) {
  return db("external_articles")
    .where("external_articles.id", external_article_id)
    .then(external_article => {
      if (user.id === external_article.creator_id || user.admin || user.owner) {
        return db("external_articles")
          .del()
          .where("external_articles.id", external_article_id);
      }
    });
}

function findByFilter(filter, query) {
  let queryTweak = query.toLowerCase();
  return db("articles").whereRaw(`LOWER(articles.${filter}) ~ ?`, [queryTweak]);
}

function findByTag(tag) {
  let tagTweak = tag.toLowerCase();
  return db("external_articles")
    .join(
      "tags_external_articles",
      "tags_external_articles.path_id",
      "external_articles.id"
    )
    .join("tags", "tags.id", "tags_external_articles.tag_id")
    .whereRaw("LOWER(tags.name) ~ ?", [tagTweak])
    .select("external_articles.*", "tags.name as tag")
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
      return db("external_articles")
        .join("users", "external_articles.creator_id", "users.id")
        .where("external_articles.creator_id", user.id)
        .select(
          "external_articles.*",
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
