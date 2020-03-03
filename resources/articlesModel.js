const db = require('../database/dbConfig.js')

module.exports = {
    get,
    getById,
    add,
    update,
    del
}

function get() {
    return db("articles")
}

function getById(id) {
    return db("articles").where({ id })
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