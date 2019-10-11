
exports.up = function(knex) {
    return knex.schema
    .createTable('users', tbl =>
    {
        tbl.increments()
        tbl.string('email', 255).notNullable().unique()
        tbl.string('first_name', 255).notNullable()
        tbl.string('last_name', 255).notNullable()
        tbl.string('password', 255)
        tbl.string('facebookID')
        tbl.string('googleID')
        tbl.string('slackID')
    })
    .createTable('courses', tbl =>
    {
        tbl.increments()
        tbl.string('name', 255).notNullable()
        tbl.string('link', 1000)
        tbl.string('description', 5000)
        tbl.string('category', 125)
        tbl
        .integer('creator_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        tbl.string('foreign_rating')
        tbl.string('foreign_instructors')
    })
    .createTable('paths', tbl =>
    {
        tbl.increments()
        tbl.string('name', 255).notNullable()
        tbl.string('description', 1000)
        tbl.string('category', 125)
    })
    .createTable('tags', tbl =>
    {
        tbl.increments()
        tbl.string('name', 150).notNullable()
    })
    .createTable('tags_courses', tbl =>
    {
        tbl
            .integer('tag_id')
            .unsigned()
            .references('id')
            .inTable('tags')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('course_id')
            .unsigned()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.primary(['tag_id', 'course_id'])
    })
    .createTable('tags_paths', tbl =>
    {
        tbl
            .integer('tag_id')
            .unsigned()
            .references('id')
            .inTable('tags')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('path_id')
            .unsigned()
            .references('id')
            .inTable('paths')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.primary(['tag_id', 'path_id'])
    })
    .createTable('paths_courses', tbl =>
    {
        tbl
            .integer('path_id')
            .unsigned()
            .references('id')
            .inTable('paths')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('course_id')
            .unsigned()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.integer('path_order').notNullable()

        tbl.primary(['path_id', 'course_id'])
    })
    
    .createTable('users_paths', tbl =>
    {
        tbl
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('path_id')
            .unsigned()
            .references('id')
            .inTable('paths')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        
        tbl.boolean('created').notNullable().defaultTo(0)
        tbl.integer('rating').notNullable().defaultTo(0)

        tbl.primary(['user_id', 'path_id'])
    })


};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users_paths')
        .dropTableIfExists('paths_courses')
        .dropTableIfExists('tags_paths')
        .dropTableIfExists('tags_courses')
        .dropTableIfExists('tags')
        .dropTableIfExists('paths')
        .dropTableIfExists('courses')
        .dropTableIfExists('users')
};
