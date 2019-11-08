exports.seed = function(knex, Promise)
{
    return knex('users_sections')
    .insert(
        [
            {
                user_id: 1,
                section_id: 1,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                section_id: 2,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                section_id: 3,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                section_id: 4,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                section_id: 5,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                section_id: 6,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                section_id: 7,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                section_id: 8,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 1,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 2,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 3,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 4,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 5,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 6,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 7,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                section_id: 8,
                manually_completed: false,
                automatically_completed: false
            },
        ]
    )
}