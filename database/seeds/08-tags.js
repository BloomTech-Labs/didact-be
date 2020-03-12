exports.seed = function(knex, Promise) {
  return knex("tags").insert([
    {
      name: "Learning"
    },
    {
      name: "Coursera"
    },
    {
      name: "Free"
    },
    {
      name: "Community"
    },
    {
      name: "Udemy"
    },
    {
      name: "Meetings"
    },
    {
      name: "Development"
    },
    {
      name: "University"
    },
    {
      name: "Writing"
    }
  ]);
};
