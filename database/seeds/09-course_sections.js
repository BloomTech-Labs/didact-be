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
                {
                    name: "Chunking",
                    course_id: 2,
                    description: "In this module, we’re going to be talking about chunks. Chunks are compact packages of information that your mind can easily access. We’ll talk about how you can form chunks, how you can use them to improve your understanding and creativity with the material, and how chunks can help you to do better on tests. We’ll also explore illusions of competence in learning, the challenges of overlearning, and the advantages of interleaving.",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/home/week/2",
                    order: 2,
                },
                {
                    name: "Procrastination and Memory",
                    course_id: 3,
                    description: "In this module, we talk about two intimately connected ideas—procrastination and memory. Building solid chunks in long term memory--chunks that are easily accessible by your short term memory—takes time. This is why learning to handle procrastination is so important. Finally, we talk about some of the best ways to access your brain’s most powerful long term memory systems.",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/home/week/3",
                    order: 3,
                },
                {
                    name: "Renaissance Learning and Unlocking Your Potential",
                    course_id: 4,
                    description: "In this module we’re going to talk more about important ideas and techniques that will enhance your ability to learn. You’ll also discover how to more profitably interact with fellow learners, how to recognize your own strengths, and how to avoid the “imposter syndrome.” Fighter pilots and surgeons use checklists to help them with their critical duties—you can use a similar checklist to help you prepare for tests. Ultimately, you will learn more about the joys of living a life filled with learning!",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/home/week/3",
                    order: 4,
                },
            ]
        )
}