exports.seed = function(knex, Promise)
{
    return knex('courses')
    .insert(
        [
            {
                title: "Learning How to Learn",
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
                topic: "Learning"
            },
            {
                title: "Mindshift: Break Through Obstacles to Learning and Discover Your Hidden Potential",
                link: "https://www.coursera.org/learn/mindshift",
                description: "Mindshift is designed to help boost your career and life in today’s fast-paced learning environment." +
                " Whatever your age or stage, Mindshift teaches you essentials such as how to get the most out of online learning and MOOCs," +
                " how to seek out and work with mentors, the secrets to avoiding career ruts (and catastrophes) and general ruts in life," +
                " and insights such as the value of selective ignorance over general competence.  We’ll provide practical insights from" +
                " science about how to learn and change effectively even in maturity, and we’ll build on what you already know to take" +
                " your life’s learning in fantastic new directions.  This course is designed to show you how to look at what you’re learning," +
                " and your place in what’s unfolding in the society around you, so you can be what you want to be, given the real world" +
                " constraints that life puts on us all. You’ll see that by using certain mental tools and insights, you can learn and do" +
                " more—far more—than you might have ever dreamed!" +
                " This course can be taken independent of, concurrent with, or subsequent to, its companion course, Learning How to Learn." + 
                " (Mindshift is more career focused, and Learning How to Learn is more learning focused.)",
                creator_id: 1,
                foreign_instructors: "Dr. Barbara Oakley, Dr. Terrence Sejnowski, M.S. Orlando Trejo",
                foreign_rating: "4.8 stars",
                topic: "Learning"
            }
        ]
    )
}