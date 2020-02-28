exports.seed = function(knex, Promise)
{
    return knex('tools')
    .insert(
        [
            {
                name: "Zoom",
                description: "Zoom offers communications software that combines video conferencing, online meetings, chat, and mobile collaboration.",
                creator_id: 1,
                link: "https://zoom.us/"
            },
            {
                name: "Discord",
                description: "Discord is a proprietary freeware VoIP application and digital distribution platform designed for communities, that specializes in text, image, video and audio communication between users in a chat channel.",
                creator_id: 2,
                link: "https://discordapp.com/"
            },
        ]
    )
}