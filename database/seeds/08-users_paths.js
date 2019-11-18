exports.seed = function(knex, Promise)
{
    return knex('users_paths')
    .insert(
        [
            {
                user_id: 1,
                path_id: 1,
                created: true,
                rating: 0,
                user_path_order: 0
            },
            {
                user_id: 2,
                path_id: 1,
                created: false,
                rating: 0,
                user_path_order: 0
            },
            {
                user_id: 2,
                path_id: 2,
                created: true,
                rating: 0,
                user_path_order: 1
            },
        ]
    )
}