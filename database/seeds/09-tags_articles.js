exports.seed = function(knex, Promise)
{
    return knex('tags_articles')
    .insert(
        [
            {
                article_id: 1,
                tag_id: 7
            },
        ]
    )
}