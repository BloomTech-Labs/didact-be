exports.seed = function(knex, Promise) {
  return knex("sources").insert([
    {
      image:
        "https://www.real.discount/wp-content/uploads/2018/04/kisspng-coursera-logo-computer-icons-image-clip-art-best-educational-apps-for-iphone-7-2-17-best-revie-5b6c7a85442644.9271959815338359092792.png",
      name: "Coursera",
      description:
        "Coursera is an American online learning platform founded in 2012 by Stanford professors Andrew Ng and Daphne Koller that offers massive open online courses, specializations, and degrees.",
      creator_id: 1,
      link: "https://www.coursera.org/"
    },
    {
      image: "https://www.udemy.com/staticx/udemy/images/v6/logo-coral.svg",
      name: "Udemy",
      description:
        "Udemy is an online learning platform aimed at professional adults and students, developed in May 2010. As of Jan 2020, the platform has more than 50 million students and 57,000 instructors teaching courses in over 65 languages.",
      creator_id: 2,
      link: "https://www.udemy.com/"
    },
    {
      image:
        "https://www.edx.org/sites/default/files/theme/edx-logo-header.png",
      name: "edX",
      description:
        "edX is a massive open online course provider. It hosts online university-level courses in a wide range of disciplines to a worldwide student body, including some courses at no charge.",
      creator_id: 2,
      link: "https://www.edx.org/"
    }
  ]);
};
