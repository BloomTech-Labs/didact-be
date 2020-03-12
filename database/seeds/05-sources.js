exports.seed = function(knex, Promise) {
  return knex("sources").insert([
    {
      name: "Coursera",
      description:
        "Coursera is an American online learning platform founded in 2012 by Stanford professors Andrew Ng and Daphne Koller that offers massive open online courses, specializations, and degrees.",
      creator_id: 1,
      link: "https://www.coursera.org/"
    },
    {
      name: "Udemy",
      description:
        "Udemy is an online learning platform aimed at professional adults and students, developed in May 2010. As of Jan 2020, the platform has more than 50 million students and 57,000 instructors teaching courses in over 65 languages.",
      creator_id: 2,
      link: "https://www.udemy.com/"
    },
    {
      name: "edX",
      description:
        "edX is a massive open online course provider. It hosts online university-level courses in a wide range of disciplines to a worldwide student body, including some courses at no charge.",
      creator_id: 2,
      link: "https://www.edx.org/"
    }
  ]);
};
