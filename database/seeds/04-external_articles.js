exports.seed = function(knex, Promise) {
  return knex("external_articles").insert([
    {
      topic: "Learning",
      title: "Learning To Learn: You, Too, Can Rewire Your Brain.",
      description:
        "Learn how you can manipulate your mind to become more proficient at learning.",
      creator_id: 1,
      link:
        "https://www.nytimes.com/2017/08/04/education/edlife/learning-how-to-learn-barbara-oakley.html",
      date: "8/4/2017"
    },
    {
      topic: "Health",
      title: "From Adequate Nutrition To Optimal Nutrition",
      description:
        "What is the difference between adequate nutrition and optimal nutrition?",
      creator_id: 1,
      link:
        "https://nutritionfacts.org/2019/03/12/from-adequate-nutrition-to-optimum-nutrition/",
      date: "3/12/2019"
    }
  ]);
};
