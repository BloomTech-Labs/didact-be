exports.seed = function(knex, Promise)
{
    return knex('paths')
    .insert(
        [
            {
                name: "Getting Started with Didact",
                description: "This learning path will get you on the road to success.",
                creator_id: 1,
                topic: "Didact"
            },
            {
                name: "Python Basics",
                description: "Learn the basics of Python scripting language.",
                creator_id: 2,
                topic: "Python"
            },
        ]
    )
}