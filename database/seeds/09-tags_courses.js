exports.seed = function(knex, Promise)
{
    return knex('tags_courses')
    .insert(
        [
            {
                tag_id: 1,
                course_id: 1,
            },
            {
                tag_id: 2,
                course_id: 1,
            },
            {
                tag_id: 3,
                course_id: 1,
            },
            {
                tag_id: 1,
                course_id: 2,
            },
            {
                tag_id: 2,
                course_id: 2,
            },
            {
                tag_id: 3,
                course_id: 2,
            },
        ]
    )
}