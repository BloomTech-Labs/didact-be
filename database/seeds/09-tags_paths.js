exports.seed = function(knex, Promise)
{
    return knex('tags_paths')
    .insert(
        [
            {
                tag_id: 1,
                path_id: 1,
            },
            {
                tag_id: 3,
                path_id: 1,
            },
            {
                tag_id: 2,
                path_id: 2,
            },
            {
                tag_id: 3,
                path_id: 2,
            },
        ]
    )
}