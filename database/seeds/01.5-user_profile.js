exports.seed = function(knex, Promise) {
  return knex("user_profile").insert([
    {
      user_id: 1,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About the owner."
    },
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
    },
    {
      user_id: 4,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Tom...."
    },
    {
      user_id: 5,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About John...."
    },
    {
      user_id: 6,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Stephen...."
    },
    {
      user_id: 7,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Alice...."
    },
    {
      user_id: 8,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Carlos...."
    },
    {
      user_id: 9,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Seigfreid...."
    },
    {
      user_id: 10,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Isabel..."
    },
    {
      user_id: 11,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Suzzette..."
    },
    {
      user_id: 12,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Felicity..."
    },
    {
      user_id: 13,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Patrick..."
    },
    {
      user_id: 14,
      image:
        "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png",
      bio: "About Michael..."
    }
  ]);
};
