/**
 * ============================================================================
 *  WEDDING CONFIG  -  the one file you edit to personalise the invitation.
 * ============================================================================
 *
 *  Everything marked  // PLACEHOLDER  is demonstration content and MUST be
 *  replaced before you share the site (names, date, venue, story, contacts).
 *
 *  Localised text is written as { en: '...', ru: '...' }. Add a language by
 *  (1) adding its code to languages.available, (2) adding a block for it in
 *  strings.js (interface text), and (3) adding that code to every { } text
 *  below. If a language is missing, the default language is used instead.
 *
 *  Inside localised text, *asterisks* make an italic accent: "join *us*".
 *
 *  Remove a whole section by setting it to false in `sections`.
 *  Replace a picture by changing its path in `images` (see README).
 */
window.WEDDING_CONFIG = {

  /* ---------------------------------------------------------------- Language */
  languages: {
    default: 'ru',
    available: ['en', 'ru'],   // first-time visitors see their browser language if listed here
    detect: true,              // false = always start in `default`
  },

  /* ---------------------------------------------------------------- Sections */
  sections: {
    story: false,       // "Our story" - off until the couple's real story is added
    countdown: true,
    schedule: false,      // off until the real programme is added
    venue: true,
    dressCode: true,
    rsvp: true,
  },

  /* ------------------------------------------------------------------ Couple */
  couple: {                                            // PLACEHOLDER
    first:  { en: 'Bekbolat', ru: 'Бекболат' },
    second: { en: 'Madina',   ru: 'Мадина' },
    hashtag: '',                                       // e.g. '#БекболатИМадина' ('' hides it)
  },

  /* ------------------------------------------------------------------- Event */
  event: {
    // Local wall-clock time AT THE VENUE, written YYYY-MM-DDTHH:MM.
    // The countdown converts it using `timeZone`, so it is correct for every
    // visitor wherever they are. Use an IANA name such as 'Europe/Paris',
    // 'Asia/Almaty', 'America/New_York'.
    start: '2027-03-20T19:00',
    timeZone: 'Asia/Atyrau',                         // Atyrau, UTC+5
    placeLabel: { en: 'Atyrau, Kazakhstan', ru: 'Атырау, Казахстан' },
  },

  /* ------------------------------------------------------------------ Images */
  // Paths are relative to index.html. Swap in your own photographs
  // (JPG/WebP, about 2000px wide for the hero, 1200px for the rest).
  images: {
    hero:    'images/hero.svg',
    story1:  'images/story1.svg',
    story2:  'images/story2.svg',
    story3:  'images/story3.svg',
    venue:   'images/venue.svg',
    dress:   'images/dress.svg',
    closing: 'images/closing.svg',
  },
  // Where the focus of the hero photo should sit when it is cropped on phones.
  heroFocal: '50% 55%',

  /* -------------------------------------------------------------- Invitation */
  hero: {
    line: { en: 'We are getting married', ru: 'Мы женимся' },                       // PLACEHOLDER
  },
  invitation: {                                                                    // PLACEHOLDER
    heading: {
      en: 'Together with our families, we joyfully invite you to *celebrate our wedding*.',
      ru: 'Вместе с нашими семьями мы с радостью приглашаем вас *отпраздновать нашу свадьбу*.',
    },
    body: {
      en: [
        'There is no one we would rather share this day with. Come for the ceremony, stay for the dinner, and dance with us until the lights go down.',
        'Everything you need to know is below. Please let us know whether you can join us.',
      ],
      ru: [
        'Нет людей, с которыми нам хотелось бы разделить этот день больше, чем с вами. Приходите на церемонию, оставайтесь на ужин и танцуйте с нами до самого вечера.',
        'Всё, что нужно знать, собрано ниже. Пожалуйста, сообщите нам, сможете ли вы быть с нами.',
      ],
    },
    signoff: { en: 'With all our love,', ru: 'С любовью,' },
  },

  /* ------------------------------------------------------------------- Story */
  story: [                                                                         // PLACEHOLDER
    {
      year: '2019',
      image: 'story1',
      title: { en: 'A rainy afternoon', ru: 'Дождливый день' },
      text: {
        en: 'We met in a crowded bookshop, both reaching for the last copy of the same novel. One of us gave it up. The other has never let the first forget it.',
        ru: 'Мы познакомились в переполненном книжном магазине: оба потянулись к последнему экземпляру одного и того же романа. Один из нас уступил. Другой до сих пор об этом помнит.',
      },
    },
    {
      year: '2022',
      image: 'story2',
      title: { en: 'The long way home', ru: 'Долгая дорога домой' },
      text: {
        en: 'Somewhere between a road trip that took a wrong turn and a kitchen full of failed recipes, we stopped imagining the future alone.',
        ru: 'Где-то между поездкой, свернувшей не туда, и кухней, полной неудавшихся рецептов, мы перестали представлять будущее по отдельности.',
      },
    },
    {
      year: '2026',
      image: 'story3',
      title: { en: 'The question', ru: 'Вопрос' },
      text: {
        en: 'On a quiet evening at the edge of a field, with no audience but the swallows, one of us asked. The other said yes before the question was finished.',
        ru: 'Тихим вечером на краю поля, без свидетелей, кроме ласточек, один из нас задал вопрос. Другой сказал «да» раньше, чем тот договорил.',
      },
    },
  ],

  /* ---------------------------------------------------------------- Schedule */
  // `time` is local time at the venue (24h, HH:MM). Icons: arrival, rings,
  // glass, camera, dinner, music, heart, sparkle.
  schedule: [                                                                      // PLACEHOLDER
    { time: '15:30', icon: 'arrival',
      title: { en: 'Arrival',  ru: 'Встреча гостей' },
      text:  { en: 'Find your seat and take in the garden. Welcome drinks are served.',
               ru: 'Занимайте места и осматривайтесь. Мы угощаем гостей приветственными напитками.' } },
    { time: '16:00', icon: 'rings',
      title: { en: 'Ceremony', ru: 'Церемония' },
      text:  { en: 'We exchange our vows, surrounded by the people we love most.',
               ru: 'Мы произносим клятвы в окружении самых близких людей.' } },
    { time: '17:00', icon: 'glass',
      title: { en: 'Cocktail hour', ru: 'Коктейли' },
      text:  { en: 'Drinks, music and family portraits on the lawn.',
               ru: 'Напитки, музыка и семейные фотографии на лужайке.' } },
    { time: '19:00', icon: 'dinner',
      title: { en: 'Dinner', ru: 'Ужин' },
      text:  { en: 'One long table, shared plates and a few short speeches.',
               ru: 'Один длинный стол, блюда на всех и несколько коротких тостов.' } },
    { time: '21:00', icon: 'music',
      title: { en: 'First dance and music', ru: 'Первый танец и музыка' },
      text:  { en: 'The dance floor opens. Comfortable shoes recommended.',
               ru: 'Открываем танцпол. Удобная обувь приветствуется.' } },
    { time: '23:30', icon: 'sparkle',
      title: { en: 'Farewell', ru: 'Прощание' },
      text:  { en: 'Sparklers, a last song and a ride home.',
               ru: 'Бенгальские огни, последняя песня и дорога домой.' } },
  ],

  /* ------------------------------------------------------------------- Venue */
  venue: {                                                                         // PLACEHOLDER (all of it)
    name: { en: 'Luxury Hall', ru: 'Luxury Hall' },
    addressLines: ['Атырау, Казахстан'],     // the 2GIS link below is shown as the exact address
    // What the "Get directions" buttons search for. Leave '' to use the address
    // above. Latitude/longitude ("48.8584,2.2945") gives the most exact pin.
    mapQuery: '47.114275,51.852525',   // latitude,longitude of Luxury Hall (from 2GIS)
    twoGisUrl: 'https://2gis.kz/atyrau/geo/70000001096994105/51.852525,47.114275',   // optional 2GIS button
    // Optional: paste a Google Maps "Embed a map" URL to show a live map on your
    // own hosting. Leave '' for the built-in map preview (embeds do not load
    // inside claude.ai artifacts).
    mapEmbedUrl: '',
  },

  /* -------------------------------------------------------------- Dress code */
  dressCode: {                                                                     // PLACEHOLDER
    text: {
      en: 'Garden formal. Soft, natural tones in linen and silk. Please leave white and ivory to the bride.',
      ru: 'Элегантный садовый стиль. Мягкие природные тона, лён и шёлк. Просим оставить белый и айвори невесте.',
    },
    note: {
      en: 'The ceremony is on grass, so flat shoes or block heels are kindest.',
      ru: 'Церемония пройдёт на траве, поэтому лучше выбрать плоскую подошву или устойчивый каблук.',
    },
    palette: [
      { hex: '#A5AA96', name: { en: 'Sage',  ru: 'Шалфей' } },
      { hex: '#41483A', name: { en: 'Olive', ru: 'Олива' } },
      { hex: '#D9C7AE', name: { en: 'Sand',  ru: 'Песок' } },
      { hex: '#B98E7A', name: { en: 'Clay',  ru: 'Глина' } },
      { hex: '#7C8776', name: { en: 'Moss',  ru: 'Мох' } },
    ],
  },

  /* -------------------------------------------------------------------- RSVP */
  rsvp: {
    deadline: '2027-03-01',     // PLACEHOLDER  last day to reply (YYYY-MM-DD, venue time zone)
    maxGuests: 2,               // 2 = "alone" or "with a partner" (labels in strings.js); more shows numbers
    // Where replies are sent. Leave '' until you connect a service: the form
    // will then say plainly that nothing was saved. See README, "Collecting
    // RSVPs", for Formspree / Google Apps Script / your own server.
    endpoint: '',
    format: 'json',             // 'json' or 'form' (urlencoded; simplest for Apps Script)
    dietary: false,             // show the dietary field
    message: false,             // show the message field
  },

  /* ----------------------------------------------------------------- Contact */
  contacts: [],   // no contact block; add { type: 'tel', label: {...}, value: '...' } items to show one

  /* ----------------------------------------------------------------- Closing */
  closing: {
    message: {
      en: 'Thank you for being part of our story. We cannot wait to celebrate with you.',
      ru: 'Спасибо, что вы часть нашей истории. Мы очень ждём встречи с вами.',
    },
  },
};
