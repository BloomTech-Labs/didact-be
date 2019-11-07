
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
        tbl.string('photo')
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
    .createTable('course_sections', tbl => {
        tbl.increments()
        tbl.string('name', 1500)
        tbl.integer('course_id')
        .unsigned()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        tbl.string('description', 10000)
        tbl.string('link', 1000)
        tbl.integer('order')
    })
    .createTable('section_details', tbl => {
        tbl.increments()
        tbl.string('name', 1500)
        tbl.integer('course_sections_id')
        .unsigned()
        .references('id')
        .inTable('course_sections')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        tbl.string('description', 10000)
        tbl.string('link', 1000)
        tbl.string('type', 1000)
        tbl.integer('order')
    })
    .createTable('paths', tbl =>
    {
        tbl.increments()
        tbl.string('name', 255).notNullable()
        tbl.string('description', 1000)
        tbl.string('category', 125)
        tbl.integer('creator_id').notNullable()
    })
    .createTable('path_items', tbl =>
    {
        tbl.increments()
        tbl.string('name').notNullable()
        tbl.integer('path_id')
        .unsigned()
        .references('id')
        .inTable('paths')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        tbl.string('description', 10000)
        tbl.string('link', 1000)
        tbl.string('type', 1000)
        tbl.integer('path_order')
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

    .createTable('users_path_items', tbl =>
    {
        tbl
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('path_item_id')
            .unsigned()
            .references('id')
            .inTable('path_items')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.boolean('manually_completed').notNullable().defaultTo(0)
        tbl.boolean('automatically_completed').notNullable().defaultTo(0)

        tbl.primary(['user_id', 'path_item_id'])
    })

    .createTable('users_courses', tbl =>
    {
        tbl
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('course_id')
            .unsigned()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.boolean('manually_completed').notNullable().defaultTo(0)
        tbl.boolean('automatically_completed').notNullable().defaultTo(0)

        tbl.primary(['user_id', 'course_id'])
    })

    .createTable('users_sections', tbl =>
    {
        tbl
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('course_section_id')
            .unsigned()
            .references('id')
            .inTable('course_sections')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.boolean('manually_completed').notNullable().defaultTo(0)
        tbl.boolean('automatically_completed').notNullable().defaultTo(0)

        tbl.primary(['user_id', 'course_section_id'])
    })

    .createTable('users_section_details', tbl =>
    {
        tbl
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('section_detail_id')
            .unsigned()
            .references('id')
            .inTable('section_details')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.boolean('manually_completed').notNullable().defaultTo(0)
        tbl.boolean('automatically_completed').notNullable().defaultTo(0)

        tbl.primary(['user_id', 'section_detail_id'])
    })
    
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users_section_details')
        .dropTableIfExists('users_sections')
        .dropTableIfExists('users_courses')
        .dropTableIfExists('users_path_items')
        .dropTableIfExists('users_paths')
        .dropTableIfExists('paths_courses')
        .dropTableIfExists('path_items')
        .dropTableIfExists('tags_paths')
        .dropTableIfExists('tags_courses')
        .dropTableIfExists('section_details')
        .dropTableIfExists('course_sections')
        .dropTableIfExists('tags')
        .dropTableIfExists('paths')
        .dropTableIfExists('courses')
        .dropTableIfExists('users')
};
