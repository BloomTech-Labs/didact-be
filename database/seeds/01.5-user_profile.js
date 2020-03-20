exports.seed = function(knex, Promise) {
  return knex("user_profile").insert([
    {
      user_id: 2,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "Bob is the best admin."
    },

    {
      user_id: 3,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Amy...."
    }
  ]);
};
