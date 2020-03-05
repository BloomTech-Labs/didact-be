const db = require('../database/dbConfig.js')

module.exports = {
    get,
    getById,
    getExternalById,
    add,
    addExternal,
    update,
    updateExternal,
    del,
    delExternal
}

async function get() {
    let articles = await db("articles").join("users", "users.id", "articles.id").select("users.first_name", "users.last_name", "articles.*")
    let externalArticles = await db("external_articles")
    let finalArray = articles.concat(externalArticles);
    return await finalArray
}

function getById(id) {
    return db("articles").where({ id }).first().join("users", "users.id", "articles.id").select("users.first_name", "users.last_name", "articles.*")
}

function getExternalById(id) {
    return db("external_articles").where({ id }).first()
}

function add(user_id, content) {
    return db("articles").insert({ creator_id: user_id, ...content})
}

function update(user, article_id, updates) {
    return db("articles").where("articles.id", article_id)
    .then(article => {
        if(user.id === article.creator_id || user.admin || user.owner){
            return db("articles").where("articles.id", article_id).update(updates)
        }
    })
}

function del(user, article_id) {
    return db("articles").where("articles.id", article_id)
    .then(article => {
        if(user.id === article.creator_id || user.admin || user.owner){
            return db("articles").del().where("articles.id", article_id)
        }
    })
}

function addExternal(user_id, content) {
    return db("external_articles").insert({ creator_id: user_id, ...content})
}

function updateExternal(user, external_article_id, updates) {
    return db("external_articles").where("external_articles.id", external_article_id)
    .then(external_article => {
        if(user.id === external_article.creator_id || user.admin || user.owner){
            return db("external_articles").where("external_articles.id", external_article_id).update(updates)
        }
    })
}

function delExternal(user, external_article_id) {
    return db("external_articles").where("external_articles.id", external_article_id)
    .then(external_article => {
        if(user.id === external_article.creator_id || user.admin || user.owner){
            return db("external_articles").del().where("external_articles.id", external_article_id)
        }
    })
}