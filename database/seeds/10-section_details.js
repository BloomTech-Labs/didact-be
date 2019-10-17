exports.seed = function (knex, Promise) {
    return knex('section_details')
        .insert(
            [
                {
                    name: "Introduction to the Focused and Diffuse Modes?",
                    course_sections_id: 1,
                    description: "",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/lecture/75EsZ/introduction-to-the-focused-and-diffuse-modes",
                    type: "video",
                    order: 1,
                },
                {
                    name: "Terrence Sejnowski and Barbara Oakley--Introduction to the Course Structure",
                    course_sections_id: 1,
                    description: "",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/lecture/1bYD5/terrence-sejnowski-and-barbara-oakley-introduction-to-the-course-structure",
                    type: "video",
                    order: 2,
                },
                {
                    name: "Welcome to Learning How to Learn!",
                    course_sections_id: 1,
                    description: "",
                    link: "https://www.coursera.org/learn/learning-how-to-learn/supplement/0PXPI/welcome-and-course-information",
                    type: "reading",
                    order: 3,
                },
            ]
        )
}