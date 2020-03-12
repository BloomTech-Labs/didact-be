exports.seed = function(knex, Promise) {
  return knex("articles").insert([
    {
      title: "What is Lorem Ipsum?",
      body:
        "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing" +
        " in place of English to emphasise design elements over content. It's also called placeholder " +
        "(or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements" +
        " of a document or presentation, eg typography, font, or layout. \nLorem ipsum is mostly a part of a" +
        "Latin text by the classical author and philosopher Cicero. Its words and letters have been changed" +
        "by addition or removal, so to deliberately render its content nonsensical; it's not genuine, correct," +
        "or comprehensible Latin anymore. \nWhile lorem ipsum's still resembles classical Latin, it actually has no" +
        "meaning whatsoever. As Cicero's text doesn't contain the letters K, W, or Z, alien to latin, these, and" +
        "others are often inserted randomly to mimic the typographic appearence of European languages, as are" +
        "digraphs not to be found in the original. In a professional context it often happens that private or" +
        "corporate clients corder a publication to be made and presented with the actual content still not being ready" +
        ". Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to" +
        "be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are" +
        "likely to focus on the text, disregarding the layout and its elements. Besides, random text risks to be" +
        "unintendedly humorous or offensive, an unacceptable risk in corporate environments. Lorem ipsum and its many" +
        "variants have been employed since the early 1960ies, and quite likely since the sixteenth century.",
      creator_id: 1,
      topic: "Development",
      date: "2/28/2020"
    },
    {
      title: "The Foods to Avoid to Lower Stroke Risk",
      body:
        "“Stroke remains one of the most devastating of all neurological diseases,” killing about 5 million people a year worldwide, and is “the leading cause of permanent disability in the USA.” But the good news is that about 80 percent of stroke risk may be due to basic lifestyle factors: primarily, improving our diet, stopping smoking, and getting regular exercise.\n " +
        "The best way to stop smoking, evidently, is to have a heart attack. Certainly, once dead, you can’t smoke. Of those who survive a heart attack, strong, repeated advice from their doctor may persuade up to two-thirds to quit and never smoke again in any form as long as they live. “Yes, quitting smoking is very difficult. It doesn’t matter; it has to be done. If you were walking along the lakeshore and one of your grandchildren is drowning, it doesn’t take will power to go into the lake; it just has to be done.” It’s like a healthy diet: Some things just have to be done. Getting up at night to feed a baby can be difficult, too, but it’s not a matter of having willpower—some things in life just have to be done. After all, what we regularly eat every day is indeed a matter of life and death.\n " +
        "For stroke prevention, that means eating a more plant-based diet, like a traditional Mediterranean diet centered around whole grains, fruits, vegetables, lentils, beans, and nuts, as I discuss in my video Best Foods to Reduce Stroke Risk. A vegetarian or vegan diet may also work, but it must be accompanied by a regular, reliable source of vitamin B12, meaning B12-fortified foods or supplements. “Unfortunately, recommending taking B12 supplements may meet opposition among vegetarians because misconceptions regarding this nutrient are prevalent. Many individuals still hold on to the old myth that deficiency of this vitamin is rare and occurs only in a small proportion of vegans…Future studies with vegetarians should focus on identifying ways of convincing vegetarians to routinely take vitamin B12 supplements in order to prevent a deficiency.” The research is clear on that.",
      creator_id: 1,
      topic: "Health",
      date: "3/10/2020"
    }
  ]);
};
