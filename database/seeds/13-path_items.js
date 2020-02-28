exports.seed = function(knex, Promise)
{
    return knex('path_items')
    .insert(
        [
            {
                name: 'Getting the most out of your eLearning courses',
                path_id: 1,
                description: '',
                type: 'article',
                link: "https://elearningindustry.com/10-study-tips-for-online-learners-getting-the-most-out-of-your-elearning-course",
                path_order: 4
            },
            {
                name: 'Success as an Online Student',
                path_id: 1,
                description: '',
                type: 'book',
                link: "https://www.amazon.com/Success-Online-Student-Strategies-Effective/dp/1455776327",
                path_order: 5
            },
            {
                name: 'Understanding How We Learn',
                path_id: 1,
                description: '',
                type: 'book',
                link: "https://www.amazon.com/Understanding-How-We-Learn-Visual/dp/113856172X/",
                path_order: 6
            },
            {
                name: 'The Era of Online Learning',
                path_id: 1,
                description: 'TED Talk',
                type: 'video',
                link: "https://www.youtube.com/watch?v=5JKgUoY9pTg",
                path_order: 7
            },
        ]
    )
}