exports.seed = function(knex, Promise)
{
    return knex('paths')
    .insert(
        [
            {
                name: "Onboarding Learning Path",
                description: "This learning path will get you on the road to success.",
                category: "Learning",
                creator_id: 1
            },
        ]
    )
}