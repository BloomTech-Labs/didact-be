exports.seed = function(knex, Promise)
{
    return knex('paths_courses')
    .insert(
        [
            {
                path_id: 1,
                course_id: 1,
                path_order: 0
            },
            {
                path_id: 1,
                course_id: 2,
                path_order: 0
            },
        ]
    )
}