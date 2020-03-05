const db = require('../database/dbConfig.js')

module.exports = {
    get,
    getById,
    add,
    update,
    del
}

function get() {
    return db("tools")
}

function getById(id) {
    return db("tools").where({ id }).first();
}

function add(user_id, content) {
    return db("tools").insert({ creator_id: user_id, ...content})
}

function update(user, tool_id, updates) {
    return db("tools").where("tools.id", tool_id)
    .then(tool => {
        if(user.id === tool.creator_id || user.admin|| user.owner){
            return db("tools").where("tools.id", tool_id).update(updates)
        }
    })
}

function del(user, tool_id) {
    return db("tools").where("tools.id", tool_id)
    .then(tool => {
        if(user.id === tool.creator_id || user.admin || user.owner){
            return db("tools").del().where("tools.id", tool_id)
        }
    })
}