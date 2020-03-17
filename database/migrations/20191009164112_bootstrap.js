exports.up = function (knex) {
  return knex.schema
    .createTable("users", tbl => {
      tbl.increments();
      tbl
        .string("email", 255)
        .notNullable()
        .unique();
      tbl.string("first_name", 255).notNullable();
      tbl.string("last_name", 255).notNullable();
      tbl.string("image", 500);
      tbl.string("password", 255);
      tbl.string("facebookID");
      tbl.string("googleID");
      tbl.string("slackID");
      tbl.string("photo");
      tbl.boolean("owner").defaultTo(false);
      tbl.boolean("admin").defaultTo(false);
      tbl.boolean("moderator").defaultTo(false);

    })
    .createTable("courses", tbl => {
      tbl.increments();
      tbl.string("title", 255).notNullable();
      tbl.string("link", 1000);
      tbl.string("description", 5000);
      tbl.string('topic', 1000).notNullable();
      tbl
        .integer("creator_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("foreign_rating");
      tbl.string("foreign_instructors");
    })
    .createTable("course_sections", tbl => {
      tbl.increments();
      tbl.string("name", 1500);
      tbl
        .integer("course_id")
        .unsigned()
        .references("id")
        .inTable("courses")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("description", 10000);
      tbl.string("link", 1000);
      tbl.integer("order");
    })
    .createTable("section_details", tbl => {
      tbl.increments();
      tbl.string("name", 1500);
      tbl
        .integer("course_sections_id")
        .unsigned()
        .references("id")
        .inTable("course_sections")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("description", 10000);
      tbl.string("link", 1000);
      tbl.string("type", 1000);
      tbl.integer("order");
    })
    .createTable("paths", tbl => {
      tbl.increments();
      tbl.string("title", 255).notNullable();
      tbl.string("description", 1000);
      tbl.integer("creator_id").notNullable();
      tbl.string("topic", 1000).notNullable();
      tbl.string("font_awesome_name", 1000);
    })
    .createTable("path_items", tbl => {
      tbl.increments();
      tbl.string("name").notNullable();
      tbl
        .integer("path_id")
        .unsigned()
        .references("id")
        .inTable("paths")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("description", 10000);
      tbl.string("link", 1000);
      tbl.string("type", 1000);
      tbl.integer("path_order");
    })
    .createTable("tags", tbl => {
      tbl.increments();
      tbl.string("name", 150).notNullable();
    })
    .createTable("tags_courses", tbl => {
      tbl
        .integer("tag_id")
        .unsigned()
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("course_id")
        .unsigned()
        .references("id")
        .inTable("courses")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.primary(["tag_id", "course_id"]);
    })
    .createTable("tags_paths", tbl => {
      tbl
        .integer("tag_id")
        .unsigned()
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("path_id")
        .unsigned()
        .references("id")
        .inTable("paths")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.primary(["tag_id", "path_id"]);
    })
    .createTable("paths_courses", tbl => {
      tbl
        .integer("path_id")
        .unsigned()
        .references("id")
        .inTable("paths")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("course_id")
        .unsigned()
        .references("id")
        .inTable("courses")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.integer("path_order").notNullable();
      tbl.primary(["path_id", "course_id"]);
    })
    .createTable("users_paths", tbl => {
      tbl
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("path_id")
        .unsigned()
        .references("id")
        .inTable("paths")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .boolean("created")
        .notNullable()
        .defaultTo(0);
      tbl
        .integer("rating")
        .notNullable()
        .defaultTo(0);
      tbl.integer("user_path_order").notNullable();
      tbl
        .boolean("manually_completed")
        .notNullable()
        .defaultTo(0);
      tbl
        .boolean("automatically_completed")
        .notNullable()
        .defaultTo(0);
      tbl.primary(["user_id", "path_id"]);
    })
    .createTable("users_path_items", tbl => {
      tbl
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("path_item_id")
        .unsigned()
        .references("id")
        .inTable("path_items")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .boolean("manually_completed")
        .notNullable()
        .defaultTo(0);
      tbl
        .boolean("automatically_completed")
        .notNullable()
        .defaultTo(0);
      tbl.primary(["user_id", "path_item_id"]);
    })
    .createTable("users_courses", tbl => {
      tbl
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("course_id")
        .unsigned()
        .references("id")
        .inTable("courses")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .boolean("manually_completed")
        .notNullable()
        .defaultTo(0);
      tbl
        .boolean("automatically_completed")
        .notNullable()
        .defaultTo(0);
      tbl.primary(["user_id", "course_id"]);
    })
    .createTable("users_sections", tbl => {
      tbl
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("section_id")
        .unsigned()
        .references("id")
        .inTable("course_sections")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .boolean("manually_completed")
        .notNullable()
        .defaultTo(0);
      tbl
        .boolean("automatically_completed")
        .notNullable()
        .defaultTo(0);
      tbl.primary(["user_id", "section_id"]);
    })
    .createTable("users_section_details", tbl => {
      tbl
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("section_detail_id")
        .unsigned()
        .references("id")
        .inTable("section_details")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .boolean("manually_completed")
        .notNullable()
        .defaultTo(0);
      tbl
        .boolean("automatically_completed")
        .notNullable()
        .defaultTo(0);
      tbl.primary(["user_id", "section_detail_id"]);
    })
    .createTable("email_list", tbl => {
      tbl.increments();
      tbl
        .string("email", 500)
        .unique()
        .notNullable();
    })
    .createTable("sources", tbl => {
      tbl.increments();
      tbl
        .integer("creator_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("name", 1000).notNullable();
      tbl.string("description", 10000).notNullable();
      tbl.string("link", 1000).notNullable();
    })
    .createTable("tools", tbl => {
      tbl.increments();
      tbl
        .integer("creator_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("name", 1000).notNullable();
      tbl.string("description", 10000).notNullable();
      tbl.string("link", 1000).notNullable();
    })
    .createTable("articles", tbl => {
      tbl.increments();
      tbl
        .integer("creator_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("topic", 1000).notNullable();
      tbl.string("title", 1000).notNullable().unique();
      tbl.string("body", 10000).notNullable();
      tbl.string("date", 10).notNullable();
    })
    .createTable("external_articles", tbl => {
      tbl.increments();
      tbl
        .integer("creator_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("topic", 1000).notNullable();
      tbl.string("title", 1000).notNullable().unique();
      tbl.string("description", 1000).notNullable();
      tbl.string("link", 1000).notNullable();
      tbl.string("date", 10).notNullable();
    })
    .createTable("tags_sources", tbl => {
      tbl.increments();
      tbl
        .integer("source_id")
        .unsigned()
        .references("id")
        .inTable("sources")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("tag_id")
        .unsigned()
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("tags_tools", tbl => {
      tbl.increments();
      tbl
        .integer("tool_id")
        .unsigned()
        .references("id")
        .inTable("tools")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
      tbl
        .integer("tag_id")
        .unsigned()
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");;
    })
    .createTable("tags_articles", tbl => {
      tbl.increments();
      tbl
        .integer("article_id")
        .unsigned()
        .references("id")
        .inTable("articles")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
      tbl
        .integer("tag_id")
        .unsigned()
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");;
    })
    .createTable("tags_external_articles", tbl => {
      tbl.increments();
      tbl
        .integer("external_article_id")
        .unsigned()
        .references("id")
        .inTable("articles")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
      tbl
        .integer("tag_id")
        .unsigned()
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");;
    })
};
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("email_list")
    .dropTableIfExists("users_section_details")
    .dropTableIfExists("users_sections")
    .dropTableIfExists("users_courses")
    .dropTableIfExists("users_path_items")
    .dropTableIfExists("users_paths")
    .dropTableIfExists("paths_courses")
    .dropTableIfExists("path_items")
    .dropTableIfExists("tags_paths")
    .dropTableIfExists("tags_courses")
    .dropTableIfExists("section_details")
    .dropTableIfExists("course_sections")
    .dropTableIfExists("paths")
    .dropTableIfExists("courses")
    .dropTableIfExists("tags_sources")
    .dropTableIfExists("tags_tools")
    .dropTableIfExists("tags_articles")
    .dropTableIfExists("tags_external_articles")
    .dropTableIfExists("sources")
    .dropTableIfExists("tools")
    .dropTableIfExists("external_articles")
    .dropTableIfExists("articles")
    .dropTableIfExists("tags")
    .dropTableIfExists("users");
};
