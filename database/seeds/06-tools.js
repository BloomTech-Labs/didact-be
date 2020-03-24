exports.seed = function(knex, Promise) {
  return knex("tools").insert([
    {
      image:
        "http://res.cloudinary.com/klawd/image/upload/v1585073137/nlxz61gcwcctlfffafbl.png",
      name: "Zoom",
      description:
        "Zoom offers communications software that combines video conferencing, online meetings, chat, and mobile collaboration.",
      creator_id: 1,
      link: "https://zoom.us/"
    },
    {
      image:
        "http://res.cloudinary.com/klawd/image/upload/v1585073220/sljye9dehoit1ilwx41x.png",
      name: "Discord",
      description:
        "Discord is a proprietary freeware VoIP application and digital distribution platform designed for communities, that specializes in text, image, video and audio communication between users in a chat channel.",
      creator_id: 2,
      link: "https://discordapp.com/"
    },
    {
      image:
        "http://res.cloudinary.com/klawd/image/upload/v1585073267/nw3nqoteh1g9qtgaqvgd.png",
      name: "Grammarly",
      description:
        "Compose clear, mistake-free writing that makes the right impression with Grammarly’s writing assistant.",
      creator_id: 2,
      link: "https://www.grammarly.com/"
    }
  ]);
};
