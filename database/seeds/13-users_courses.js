exports.seed = function(knex, Promise)
{
    return knex('users_courses')
    .insert(
        [
            {
                user_id: 1,
                course_id: 1,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 1,
                course_id: 2,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                course_id: 1,
                manually_completed: false,
                automatically_completed: false
            },
            {
                user_id: 2,
                course_id: 2,
                manually_completed: false,
                automatically_completed: false
            },
        ]
    )
}