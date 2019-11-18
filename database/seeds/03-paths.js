exports.seed = function(knex, Promise)
{
    return knex('paths')
    .insert(
        [
            {
                name: "Getting Started with Didact",
                description: "This learning path will get you on the road to success.",
                category: "Learning",
                creator_id: 1
            },
            {
                name: "Python Basics",
                description: "Learn the basics of Python scripting language.",
                category: "Python",
                creator_id: 2
            },
        ]
    )
}