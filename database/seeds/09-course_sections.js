exports.seed = function (knex, Promise) {
    return knex('course_sections')
        .insert(
            [
                {
                    name: "What is Learning?",
                    course_id: 1,
                    description: "Although living brains are very complex, this module uses metaphor and analogy to help simplify matters. You will discover several fundamentally different modes of thinking, and how you can use these modes to improve your learning. You will also be introduced to a tool for tackling procrastination, be given some practical information about memory, and discover surprisingly useful insights about learning and sleep. <br><br>(Please note that this module should only take about an hour--the extra time quoted relates to purely optional activities.)",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/home/week/1",
                    order: 1,
                },
            ]
        )
}