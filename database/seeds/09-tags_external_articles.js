exports.seed = function(knex, Promise)
{
    return knex('tags_external_articles')
    .insert(
        [
            {
                external_article_id: 1,
                tag_id: 1
            },
            {
                external_article_id: 1,
                tag_id: 7
            }
        ]
    )
}