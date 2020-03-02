exports.seed = function(knex, Promise)
{
    return knex('tags_sources')
    .insert(
        [
            {
                tag_id: 1,
                source_id: 1,
            },
            {
                tag_id: 2,
                source_id: 1,
            },
            {
                tag_id: 1,
                source_id: 2,
            },
            {
                tag_id: 5,
                source_id: 2
            }
        ]
    )
}