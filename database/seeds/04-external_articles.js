exports.seed = function(knex, Promise)
{
    return knex('external_articles')
    .insert(
        [
            {
                topic: "Learning",
                title: "Learning To Learn: You, Too, Can Rewire Your Brain.",
                description: "A riveting symphony of words that you can read.",
                creator_id: 1,
                link: "https://www.nytimes.com/2017/08/04/education/edlife/learning-how-to-learn-barbara-oakley.html"
            },
        ]
    )
}