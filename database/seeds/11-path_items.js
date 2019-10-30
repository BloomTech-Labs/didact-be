exports.seed = function(knex, Promise)
{
    return knex('path_items')
    .insert(
        [
            {
                name: 'seed path item',
                path_id: 1,
                description: 'temporary seed path item, until we have a better placeholder',
                type: 'video',
                path_order: 7
            },
        ]
    )
}