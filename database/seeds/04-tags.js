exports.seed = function(knex, Promise)
{
    return knex('tags')
    .insert(
        [
            {
                name: "Video",
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