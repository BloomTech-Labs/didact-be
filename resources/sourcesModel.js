const db = require('../database/dbConfig.js')

module.exports = {
    get,
    getById,
    add,
    update,
    del
}

function get() {
    return db("sources")
}

function getById(id) {
    return db("sources").where({ id })
}

function add(user_id, content) {
    return db("sources").insert({ creator_id: user_id, ...content})
}

function update(user, source_id, updates) {
    return db("sources").where("sources.id", source_id)
    .then(source => {
        if(user.id === source.creator_id || user.admin|| user.owner){
            return db("sources").where("sources.id", source_id).update(updates)
        }
    })
}

function del(user, source_id) {
    return db("sources").where("sources.id", source_id)
    .then(sources => {
        if(user.id === sources.creator_id || user.admin || user.owner){
            return db("sources").del().where("sources.id", source_id)
        }
    })
}