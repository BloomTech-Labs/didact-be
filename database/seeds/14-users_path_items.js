exports.seed = function(knex, Promise)
{
    return knex('users_path_items')
    .insert(
        [
            {
                user_id: 1,
                path_item_id: 1,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                path_item_id: 2,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                path_item_id: 3,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                path_item_id: 4,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                path_item_id: 1,
                manually_completed: false,
                automatically_completed: false
            },
        ]
    )
}