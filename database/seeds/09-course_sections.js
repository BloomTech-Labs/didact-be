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
                    course_id: 1,
                    description: "In this module, we’re going to be talking about chunks. Chunks are compact packages of information that your mind can easily access. We’ll talk about how you can form chunks, how you can use them to improve your understanding and creativity with the material, and how chunks can help you to do better on tests. We’ll also explore illusions of competence in learning, the challenges of overlearning, and the advantages of interleaving.",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/home/week/2",
                    order: 2,
                },
                {
                    name: "Procrastination and Memory",
                    course_id: 1,
                    description: "In this module, we talk about two intimately connected ideas—procrastination and memory. Building solid chunks in long term memory--chunks that are easily accessible by your short term memory—takes time. This is why learning to handle procrastination is so important. Finally, we talk about some of the best ways to access your brain’s most powerful long term memory systems.",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/home/week/3",
                    order: 3,
                },
                {
                    name: "Renaissance Learning and Unlocking Your Potential",
                    course_id: 1,
                    description: "In this module we’re going to talk more about important ideas and techniques that will enhance your ability to learn. You’ll also discover how to more profitably interact with fellow learners, how to recognize your own strengths, and how to avoid the “imposter syndrome.” Fighter pilots and surgeons use checklists to help them with their critical duties—you can use a similar checklist to help you prepare for tests. Ultimately, you will learn more about the joys of living a life filled with learning!",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/home/week/3",
                    order: 4,
                },
                // Next Course
                {
                    name: "Change IS possible",
                    course_id: 2,
                    description: "In today's world, change is the only constant. This means that whatever stage you are in life, you need to keep yourself open and able to change. How can you do this? In three ways: Learn more about your hidden capabilities and assets. Learn more about learning effectively. Learn about matching your assets with the opportunities that face you. In this week, we'll dive into these three important areas!",
                    link: "https://www.coursera.org/learn/mindshift/home/week/1",
                    order: 1,
                },
                {
                    name: "Getting deeper into happy learning",
                    course_id: 2,
                    description: "Key to your ability to mindshift is being able to learn effectively. This week, we’ll dive deeper into this vital area. Getting yourself motivated to tackle procrastination can sometimes be a challenge in learning, so we’ll give you some important tips here. But we’ll also give insights into mental tricks to help you focus, relax, and reframe if stress intrudes. We’ll also show you how to avoid common learning pitfalls. Welcome and enjoy!",
                    link: "https://www.coursera.org/learn/mindshift/home/week/2",
                    order: 2,
                },
                {
                    name: "Learning and careers",
                    course_id: 2,
                    description: "This week, we’ll be talking about how your own career can develop and change through your life. Your own internal feelings about what you want to do can play a critical role in your long-term happiness. But society and culture can also have a dramatic effect on your career choices and decisions—as can your parents, family, and friends." +
                    " We’ll talk about second-skilling yourself, and developing a talent stack of average talents that can combine into a formidable asset. We’ll also talk about various tactics and techniques to help you survive career changes and upheavals." +
                    " Welcome and enjoy!",
                    link: "https://www.coursera.org/learn/mindshift/home/week/3",
                    order: 3,
                },
                {
                    name: "Adopting a learning lifestyle",
                    course_id: 2,
                    description: "In this final week of the course, we'll be exploring how and why to keep yourself in 'mindshift' mode. We'll give you all sorts of insider tips on how to pick out the best online learning with materials that are right for you. And we'll also talk about other ways of learning—ways that can make you 'the smartest person in the room." +
                    " Disruption lies ahead in the world—this week, we'll help you seize the advantage." +
                    " Off we go for our final week of Mindshift!",
                    link: "https://www.coursera.org/learn/mindshift/home/week/4",
                    order: 4,
                },
                
                // Abyssmind sections
                {
                    name: "Day 1",
                    course_id: 3,
                    description: "Why do you want to achieve your project? Discover the power of self-awareness!",
                    order: 1,
                },


                {
                    name: "Day 2",
                    course_id: 3,
                    description: "When it's about work, what matters is not the quantity but the quality. Learn the rules of focus in a distracted world.",
                    order: 2,
                },

                {
                    name: "Day 3",
                    course_id: 3,
                    description: "Time is precious, so managing your time is the key. Keep a healthy work/life balance while still have those peak performance.",
                    order: 3,
                },

                {
                    name: "Day 4",
                    course_id: 3,
                    description: "What's the point of being focused if you don't have energy? Understand your willpower.",
                    order: 4,
                },


                {
                    name: "Day 5",
                    course_id: 3,
                    description: "Your project is a marathon, not a sprint. Learn how to keep motivation over time.",
                    order: 5,
                },


                {
                    name: "Day 6",
                    course_id: 3,
                    description: "Let's talk about learning! See why at AbyssMind, we believe that knowledge is nothing compared to actions.",
                    order: 6,
                },


                {
                    name: "Day 7",
                    course_id: 3,
                    description: "Performance is not about working 24/7 until you burn out. Learn why burnout is a sign that you're not performing well and how to prevent it.",
                    order: 7,
                },
            ]
        )
     }