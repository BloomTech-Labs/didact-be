exports.seed = function(knex, Promise)
{
    return knex('tags')
    .insert(
        [
            {
                name: "Learning",
            },
            {
                name: "Coursera",
            },
            {
                name: "Free",
            },
        ]
    )
}