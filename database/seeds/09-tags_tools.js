exports.seed = function(knex, Promise)
{
    return knex('tags_tools')
    .insert(
        [
            {
                tag_id: 3,
                tool_id: 1,
            },
            {
                tag_id: 6,
                tool_id: 1
            },
            {
                tag_id: 3,
                tool_id: 2,
            },
            {
                tag_id: 4,
                tool_id: 2,
            },
        ]
    )
}