exports.seed = function(knex, Promise)
{
    return knex('courses')
    .insert(
        [
            {
                name: "Learning How to Learn: Powerful mental tools to help you master tough subjects",
                link: "https://www.coursera.org/learn/learning-how-to-learn",
                description: "This course gives you easy access to the invaluable learning techniques" +
                " used by experts in art, music, literature, math, science, sports, and many other" +
                " disciplines. We’ll learn about the how the brain uses two very different learning modes" +
                " and how it encapsulates (“chunks”) information. We’ll also cover illusions of learning," +
                " memory techniques, dealing with procrastination, and best practices shown by research to" +
                " be most effective in helping you master tough subjects.\n\nUsing these approaches," +
                " no matter what your skill levels in topics you would like to master, you can change" +
                " your thinking and change your life. If you’re already an expert, this peep under" +
                " the mental hood will give you ideas for: turbocharging successful learning," +
                " including counter-intuitive test-taking tips and insights that will help you" + 
                " make the best use of your time on homework and problem sets. If you’re struggling," +
                " you’ll see a structured treasure trove of practical techniques that walk you through" +
                " what you need to do to get on track. If you’ve ever wanted to become better at anything," +
                " this course will help serve as your guide.",
                creator_id: 1,
                foreign_instructors: "Dr. Barbara Oakley, Dr. Terrence Sejnowski",
                foreign_rating: "4.8 stars",
            },
        ]
    )
}