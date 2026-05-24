import type { BadgeDefinition, Exhibit, Hall, HistoricalPerson, QuizSet, TimelineEvent } from '../domain/types.js'
import { exhibitHeroUrls, hallCoverUrls, portraitUrls, timelineThumbUrls } from './mediaUrls.js'

export const seedHalls: Hall[] = [
  {
    id: 'hall-old-balti',
    slug: 'old-balti',
    order: 1,
    title: {
      ro: 'Bălțiul vechi: străzi și piețe',
      ru: 'Старый Бельцы: улицы и рынки',
      en: 'Old Bălți: streets and markets',
    },
    coverImage: hallCoverUrls.oldBalti,
  },
  {
    id: 'hall-crafts',
    slug: 'crafts-workshops',
    order: 2,
    title: {
      ro: 'Meșteșuguri și ateliere',
      ru: 'Ремёсла и мастерские',
      en: 'Crafts and workshops',
    },
    coverImage: hallCoverUrls.crafts,
  },
  {
    id: 'hall-coins',
    slug: 'coins-trade',
    order: 3,
    title: {
      ro: 'Monede și comerț pe Prut',
      ru: 'Монеты и торговля на Пруте',
      en: 'Coins and trade on the Prut',
    },
    coverImage: hallCoverUrls.coins,
  },
  {
    id: 'hall-faces',
    slug: 'faces-of-the-city',
    order: 4,
    title: {
      ro: 'Chipurile orașului',
      ru: 'Лица города',
      en: 'Faces of the city',
    },
    coverImage: hallCoverUrls.faces,
  },
]

export const seedExhibits: Exhibit[] = [
  {
    id: 'exhibit-market-square',
    hallId: 'hall-old-balti',
    slug: 'central-market-1920s',
    era: 'early_modern',
    category: 'urbanism',
    title: {
      ro: 'Piața centrală în anii 1920',
      ru: 'Центральная площадь в 1920-е',
      en: 'The central square in the 1920s',
    },
    shortDescription: {
      ro: 'Planuri, fotografii și povești despre întâlniri zilnice la tarabe.',
      ru: 'Планы, фотографии и истории ежедневных встреч у прилавков.',
      en: 'Plans, photos, and stories of daily encounters at the stalls.',
    },
    longDescription: {
      ro: 'Piața a fost nodul vieții publice: legume, țesături, vești. Expoziția urmărește cum s-a lărgit frontul comercial și cum au apărut primele magazine cu vitrine.',
      ru: 'Площадь была узлом общественной жизни: овощи, ткани, новости. Экспозиция показывает рост торгового фасада и первые витрины.',
      en: 'The square was the hub of public life: produce, textiles, news. The display follows how shopfronts widened and early display windows appeared.',
    },
    heroImage: exhibitHeroUrls.marketSquare,
    relatedPersonIds: ['person-architect-anon', 'person-numismatist'],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: [
        'Piețele acoperite au redus pierderile la iarnă pentru vânzători.',
        'Primele „bonuri” scrise de mână apar alături de cântare publice.',
      ],
      ru: [
        'Крытые рынки зимой снижали потери для продавцов.',
        'Первые «боны» от руки появляются рядом с общественными весами.',
      ],
      en: [
        'Covered markets reduced winter losses for sellers.',
        'Early handwritten chits appear next to public weighing scales.',
      ],
    },
  },
  {
    id: 'exhibit-street-facade',
    hallId: 'hall-old-balti',
    slug: 'street-facade-ornament',
    era: 'modern',
    category: 'architecture',
    title: {
      ro: 'Fațadă de stradă: detalii ceramice',
      ru: 'Уличный фасад: керамические детали',
      en: 'Street facade: ceramic details',
    },
    shortDescription: {
      ro: 'Elemente decorative refăcute digital din fotografii vechi.',
      ru: 'Декоративные элементы, цифровое восстановление по старым фото.',
      en: 'Decorative elements digitally restored from old photographs.',
    },
    longDescription: {
      ro: 'Aticurile în trepte și medalioanele au fost produse local sau aduse pe calea ferată. Expoziția explică cum se citește o fațadă ca pe o carte deschisă a meșteșugului.',
      ru: 'Ступенчатые аттики и медальоны делали локально или привозили по железной дороге. Мы учим читать фасад как открытую книгу ремесла.',
      en: 'Stepped attics and medallions were made locally or shipped by rail. The exhibit teaches reading a facade like an open book of craft.',
    },
    heroImage: exhibitHeroUrls.streetFacade,
    relatedPersonIds: ['person-architect-anon'],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['Ceramica emailată rezista mai bine la îngheț decât vopseaua plană.'],
      ru: ['Эмалированная керамика лучше переносила мороз, чем плоская краска.'],
      en: ['Glazed ceramic resisted frost better than flat paint.'],
    },
  },
  {
    id: 'exhibit-courtyard-well',
    hallId: 'hall-old-balti',
    slug: 'courtyard-well',
    era: 'medieval',
    category: 'daily_life',
    title: {
      ro: 'Curtea interioară: fântână și grajd',
      ru: 'Внутренний двор: колодец и сарай',
      en: 'Inner courtyard: well and barn',
    },
    shortDescription: {
      ro: 'Model schematic al apei, fumului și circulației animalelor.',
      ru: 'Схема воды, дыма и движения скота.',
      en: 'A schematic of water, smoke, and animal circulation.',
    },
    longDescription: {
      ro: 'Înainte de rețelele moderne, curțile adunau familia extinsă, uneltele și animalele de povară. Sunetele și mirosurile sunt sugerate prin text și ilustrație.',
      ru: 'До современных сетей дворы объединяли расширенную семью, инструмент и вьючных животных. Звуки и запахи переданы текстом и иллюстрацией.',
      en: 'Before modern utilities, courtyards gathered extended family, tools, and draft animals. Sounds and smells are suggested through text and illustration.',
    },
    heroImage: exhibitHeroUrls.courtyardWell,
    relatedPersonIds: [],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['Fântâna adâncă filtra mai bine dacă era pavată cu piatră de râu.'],
      ru: ['Глубокий колодец лучше фильтровался, если обкладывать галькой.'],
      en: ['Deep wells filtered better when lined with river stone.'],
    },
  },
  {
    id: 'exhibit-weaver-loom',
    hallId: 'hall-crafts',
    slug: 'weaver-loom',
    era: 'early_modern',
    category: 'crafts',
    title: {
      ro: 'Război de țesut și model de covor',
      ru: 'Ткацкий станок и узор ковра',
      en: 'Loom and carpet pattern',
    },
    shortDescription: {
      ro: 'Motiv geometric inspirat de brâuri tradiționale.',
      ru: 'Геометрический мотив, вдохновлённый традиционными поясами.',
      en: 'A geometric motif inspired by traditional woven bands.',
    },
    longDescription: {
      ro: 'Țesătoarea lucra în lumină difuză, cu ritm contat de suierul suveicii. Expoziția leagă culoarea firelor de plantele din dealurile din jur.',
      ru: 'Ткачиха работала в рассеянном свете, в ритме челнока. Экспозиция связывает цвет нитей с растениями окрестных холмов.',
      en: 'Weavers worked in diffuse light, paced by the shuttle’s whisper. The display links thread colours to plants from nearby hills.',
    },
    heroImage: exhibitHeroUrls.weaverLoom,
    relatedPersonIds: [],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['Un covor „cu ochi” putea marca intrarea unei familii în comunitate.'],
      ru: ['Ковёр «с глазами» мог означать вход семьи в общину.'],
      en: ['An “eyed” carpet could mark a family’s entry into the community.'],
    },
  },
  {
    id: 'exhibit-pottery-kiln',
    hallId: 'hall-crafts',
    slug: 'pottery-kiln',
    era: 'antiquity',
    category: 'crafts',
    title: {
      ro: 'Olărit: cuptor și degresanți',
      ru: 'Гончарство: печь и отощители',
      en: 'Pottery: kiln and temper',
    },
    shortDescription: {
      ro: 'Fragmente ceramice și explainer despre ardere.',
      ru: 'Керамические фрагменты и пояснение об обжиге.',
      en: 'Ceramic sherds and a firing explainer.',
    },
    longDescription: {
      ro: 'Argila locală necesită uneori nisip fin sau crumb de olărie veche ca degresant. Vizitatorii pot compara suprafețele mate și lucioase.',
      ru: 'Местная глина иногда требует песка или дроби старой керамики как отощителя. Посетители сравнивают матовые и глянцевые поверхности.',
      en: 'Local clay sometimes needs fine sand or crushed old pots as temper. Visitors compare matte and glossy surfaces.',
    },
    heroImage: exhibitHeroUrls.potteryKiln,
    relatedPersonIds: [],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['Temperatura „de biscuit” e mai joasă decât emailul final.'],
      ru: ['Температура «бисквита» ниже, чем у финальной глазури.'],
      en: ['Biscuit firing is cooler than the final glaze fire.'],
    },
  },
  {
    id: 'exhibit-prut-coins',
    hallId: 'hall-coins',
    slug: 'prut-coins-weights',
    era: 'medieval',
    category: 'numismatics',
    title: {
      ro: 'Monede și ponderi pe ruta Prutului',
      ru: 'Монеты и гири на пути по Пруту',
      en: 'Coins and weights along the Prut route',
    },
    shortDescription: {
      ro: 'Analogii tactice: greutatea în palmă (replici).',
      ru: 'Тактильные аналоги: вес в ладони (реплики).',
      en: 'Tactile analogies: weight in the hand (replicas).',
    },
    longDescription: {
      ro: 'Diferite emisiuni circulau în paralel. Ponderile corectau discrepanțe între sisteme. Panoul explică falsurile frecvente și semnele de atelier.',
      ru: 'Параллельно ходили разные чеканки. Гири исправляли расхождения систем. Панель объясняет частые подделки и мастерские знаки.',
      en: 'Multiple issues circulated in parallel. Weights reconciled system gaps. The panel explains common forgeries and workshop marks.',
    },
    heroImage: exhibitHeroUrls.prutCoins,
    relatedPersonIds: ['person-numismatist'],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['O monetă tăiată („știrbită”) putea însemna tarif redus, nu fraudă.'],
      ru: ['Подрезанная монета могла означать сниженный тариф, а не мошенничество.'],
      en: ['A clipped coin could signal a reduced tariff, not fraud.'],
    },
  },
  {
    id: 'exhibit-stamp-tax',
    hallId: 'hall-coins',
    slug: 'paper-stamp-duty',
    era: 'modern',
    category: 'numismatics',
    title: {
      ro: 'Hârtii timbrate și evidența fiscală',
      ru: 'Гербовые бумаги и налоговый учёт',
      en: 'Stamped paper and fiscal records',
    },
    shortDescription: {
      ro: 'Cum se citește o vignetă pe contract.',
      ru: 'Как читать виньетку на контракте.',
      en: 'How to read a vignette on a contract.',
    },
    longDescription: {
      ro: 'Arhivele locale păstrează cereri simple: vânzare de lot, împuterniciri, scrisori oficiale. Timbrul nu e decor — e probă de plată.',
      ru: 'Местные архивы хранят простые прошения: продажа участка, доверенности, официальные письма. Марка — не украшение, а доказательство оплаты.',
      en: 'Local archives keep simple petitions: lot sales, powers of attorney, official letters. The stamp is not decoration — it is proof of payment.',
    },
    heroImage: exhibitHeroUrls.stampTax,
    relatedPersonIds: [],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['Un contract pliat de șapte ori putea purta șapte timbre mici.'],
      ru: ['Контракт, сложенный семь раз, мог иметь семь малых марок.'],
      en: ['A contract folded seven times might carry seven small stamps.'],
    },
  },
  {
    id: 'exhibit-letters-stage',
    hallId: 'hall-faces',
    slug: 'letters-and-stage',
    era: 'modern',
    category: 'personalities',
    title: {
      ro: 'Scrisori și scenă: circulația ideilor',
      ru: 'Письма и сцена: циркуляция идей',
      en: 'Letters and stage: circulating ideas',
    },
    shortDescription: {
      ro: 'Fragmente de corespondență (facsimil) și afișe de sală.',
      ru: 'Фрагменты переписки (факсимиле) и зальные афиши.',
      en: 'Correspondence fragments (facsimile) and playbills.',
    },
    longDescription: {
      ro: 'Teatrul și presa au propagat aceleași melodii și revolte estetice. Expoziția urmărește cum un text tipărit ajunge din redacție la culise.',
      ru: 'Театр и пресса распространяли одни и те же мелодии и эстетические бунты. Мы прослеживаем путь текста из редакции за кулисы.',
      en: 'Theatre and the press spread the same tunes and aesthetic revolts. The display tracks how a printed text moves from editorial desk to backstage.',
    },
    heroImage: exhibitHeroUrls.lettersStage,
    relatedPersonIds: ['person-alecsandri'],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['Afișele retipărite arată aceeași piesă cu prețuri diferite pe săptămâni.'],
      ru: ['Переизданные афиши одной пьесы показывают разные цены по неделям.'],
      en: ['Reprinted bills for one play show different prices week by week.'],
    },
  },
  {
    id: 'exhibit-school-photo',
    hallId: 'hall-faces',
    slug: 'class-photo-1935',
    era: 'contemporary',
    category: 'daily_life',
    title: {
      ro: 'Clasă și uniformă: fotografie de grup',
      ru: 'Класс и форма: групповое фото',
      en: 'Class and uniform: a group photograph',
    },
    shortDescription: {
      ro: 'Citirea detaliilor: încălțăminte, broșe, fundal pictat.',
      ru: 'Чтение деталей: обувь, броши, нарисованный фон.',
      en: 'Reading details: shoes, brooches, painted backdrops.',
    },
    longDescription: {
      ro: 'Fotografia de școală e o instituție vizuală: rânduri, disciplină, zâmbet amânat. Ghidul propune să numărați mâinile vizibile — metaforă pentru absenți.',
      ru: 'Школьное фото — визуальный институт: ряды, дисциплина, отложенная улыбка. Гид предлагает сосчитать видимые руки — метафора отсутствующих.',
      en: 'The class photo is a visual institution: rows, discipline, a postponed smile. The guide invites counting visible hands — a metaphor for absentees.',
    },
    heroImage: exhibitHeroUrls.schoolPhoto,
    relatedPersonIds: [],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: {
      ro: ['Fundalurile pictate imitau coloane antice sau grădini idilice.'],
      ru: ['Нарисованные фоны имитировали античные колонны или идиллические сады.'],
      en: ['Painted backdrops mimicked antique columns or idyllic gardens.'],
    },
  },
]

export const seedPeople: HistoricalPerson[] = [
  {
    id: 'person-alecsandri',
    slug: 'vasile-alecsandri',
    name: {
      ro: 'Vasile Alecsandri',
      ru: 'Василе Александри',
      en: 'Vasile Alecsandri',
    },
    role: {
      ro: 'Poet și dramaturg; legături cu spațiul basarabean',
      ru: 'Поэт и драматург; связи с Бессарабским краем',
      en: 'Poet and playwright; ties to Bessarabian culture',
    },
    birthYear: 1821,
    deathYear: 1890,
    bioShort: {
      ro: 'Figură centrală a literaturii române din secolul XIX, cu răsunet în teatrul și folclorul studiat în regiune.',
      ru: 'Центральная фигура румынской литературы XIX века; влияние на театр и фольклор региона.',
      en: 'A central figure of 19th-century Romanian literature with influence on theatre and regional folklore.',
    },
    portraitImage: portraitUrls.alecsandri,
    exhibitIds: ['exhibit-letters-stage'],
  },
  {
    id: 'person-architect-anon',
    slug: 'eclectic-balti',
    name: {
      ro: 'Arhitectura eclectică locală',
      ru: 'Местная эклектичная архитектура',
      en: 'Local eclectic architecture',
    },
    role: {
      ro: 'Colectiv de meșteri și arhitecți (anonimizat în expoziție)',
      ru: 'Коллектив мастеров и архитекторов (обобщённо)',
      en: 'Collective of builders and architects (generalized)',
    },
    birthYear: 1880,
    deathYear: 1940,
    bioShort: {
      ro: 'Fațade cu ornamente din ceramică, aticuri și frontoane care definesc peisajul urban al Bălților de la începutul secolului XX.',
      ru: 'Фасады с керамическими деталями, аттики и фронтоны, формирующие городской облик начала XX века.',
      en: 'Facades with ceramic ornament, attics, and pediments that shaped early 20th-century urban Bălți.',
    },
    portraitImage: portraitUrls.architectPlans,
    exhibitIds: ['exhibit-street-facade', 'exhibit-market-square'],
  },
  {
    id: 'person-numismatist',
    slug: 'prut-trade',
    name: {
      ro: 'Negustori și monetării',
      ru: 'Купцы и монетчики',
      en: 'Merchants and moneyers',
    },
    role: {
      ro: 'Rețea comercială pe coridorul Prut–Nistru',
      ru: 'Торговая сеть в коридоре Прут–Днестр',
      en: 'Trade network along the Prut–Dniester corridor',
    },
    bioShort: {
      ro: 'Monedele și ponderile din expoziție ilustrează încrederea reciprocă dintre comunități și autoritățile locale.',
      ru: 'Монеты и гири в экспозиции показывают взаимное доверие между общинами и властью.',
      en: 'Coins and weights in the show illustrate trust between communities and local authorities.',
    },
    portraitImage: portraitUrls.merchantCoins,
    exhibitIds: ['exhibit-prut-coins', 'exhibit-market-square'],
  },
]

export const seedTimelineEvents: TimelineEvent[] = [
  {
    id: 'evt-balti-fair-1588',
    year: 1588,
    era: 'early_modern',
    image: timelineThumbUrls.fair,
    relatedExhibitIds: ['exhibit-market-square'],
    title: {
      ro: 'Atestarea târgului la Bălți',
      ru: 'Первое документальное упоминание ярмарки в Бельцах',
      en: 'First documentary mention of the Bălți fair',
    },
    summary: {
      ro: 'În surse scrise apare un târg pe locul așezării — începutul unei piețe stabile pentru regiune.',
      ru: 'В письменных источниках фиксируется ярмарка на месте поселения — задел постоянной торговой жизни.',
      en: 'Written sources record a fair at the settlement — the start of a stable marketplace for the region.',
    },
    detail: {
      ro: 'Cronologia urbană a orașului Bălți folosește frecvent anul 1588 ca primă atestare documentară a târgului.',
      ru: 'Городская хронология Бельц часто отсчитывает от 1588 года как от первого документального упоминания ярмарки.',
      en: 'Urban chronicles of Bălți often cite 1588 as the first documentary mention of the fair.',
    },
  },
  {
    id: 'evt-bessarabia-1812',
    year: 1812,
    era: 'early_modern',
    image: timelineThumbUrls.rail,
    relatedExhibitIds: ['exhibit-prut-coins', 'exhibit-stamp-tax'],
    title: {
      ro: 'Basarabia în Imperiul Rus (1812)',
      ru: 'Бессарабия в составе Российской империи (1812)',
      en: 'Bessarabia under the Russian Empire (1812)',
    },
    summary: {
      ro: 'Tratatul de la București încheie un război ruso-turc; estul Principatului Moldovei este anexat Imperiului Rus.',
      ru: 'Бухарестский мир завершает русско-турецкую войну; восточная часть Молдавского княжества отходит России.',
      en: 'The Treaty of Bucharest ends a Russo-Turkish war; the eastern part of the Principality of Moldavia is annexed by the Russian Empire.',
    },
    detail: {
      ro: 'La 28 mai/9 iunie 1812, tratatul dintre Rusia și Imperiul Otoman consfințește trecerea teritoriului dintre Prut și Nistru la Rusia.',
      ru: '28 мая/9 июня 1812 года Бухарестский трактат закрепляет переход земель между Прутом и Днестром к России.',
      en: 'On 28 May / 9 June 1812, the treaty transfers the land between the Prut and the Dniester to Russia.',
    },
  },
  {
    id: 'evt-union-1918',
    year: 1918,
    era: 'modern',
    image: timelineThumbUrls.street,
    relatedExhibitIds: ['exhibit-street-facade', 'exhibit-letters-stage'],
    title: {
      ro: 'Unirea Basarabiei cu România',
      ru: 'Присоединение Бессарабии к Румынии',
      en: 'Bessarabia votes to unite with Romania',
    },
    summary: {
      ro: 'Sfatul Țării hotărăște unirea cu Regatul României; Basarabia intră într-un stat național românesc până la 1940.',
      ru: 'Сфатул Цэрий принимает решение о соединении с Королевством Румыния.',
      en: 'Sfatul Țării votes to join the Kingdom of Romania; Bessarabia is part of a Romanian national state until 1940.',
    },
    detail: {
      ro: 'La 27 martie/stil vechi (9 aprilie stil nou) 1918, deputații din Chișinău votează unirea.',
      ru: '27 марта (9 апреля) 1918 года депутаты в Кишинёве проголосовали за присоединение к Румынии.',
      en: 'On 27 March / 9 April 1918, deputies in Chișinău vote for union.',
    },
  },
  {
    id: 'evt-soviet-1940',
    year: 1940,
    era: 'modern',
    image: timelineThumbUrls.stamp,
    relatedExhibitIds: ['exhibit-stamp-tax', 'exhibit-school-photo'],
    title: {
      ro: 'Ultimatumul sovietic și schimbarea statului (1940)',
      ru: 'Советский ультиматум и смена государственности (1940)',
      en: 'Soviet ultimatum and a change of state (1940)',
    },
    summary: {
      ro: 'În iunie 1940, URSS obligă România să evacueze Basarabia; începe perioada sovietică pentru regiune.',
      ru: 'В июне 1940 года СССР требует вывода румынских войск; для региона начинается советский период.',
      en: 'In June 1940, the USSR forces Romania to withdraw from Bessarabia; the Soviet period begins for the region.',
    },
    detail: {
      ro: 'După ultimatumul din 26–28 iunie 1940, trupele sovietice intră.',
      ru: 'После ультиматума 26–28 июня 1940 года вводятся советские войска.',
      en: 'After the ultimatum of 26–28 June 1940, Soviet troops move in.',
    },
  },
  {
    id: 'evt-moldova-independence-1991',
    year: 1991,
    era: 'contemporary',
    image: timelineThumbUrls.flag,
    relatedExhibitIds: ['exhibit-letters-stage'],
    title: {
      ro: 'Independența Republicii Moldova',
      ru: 'Независимость Республики Молдова',
      en: 'Independence of the Republic of Moldova',
    },
    summary: {
      ro: 'La 27 august 1991, Parlamentul adoptă Declarația de Independență față de URSS.',
      ru: '27 августа 1991 года парламент принимает Декларацию независимости от СССР.',
      en: 'On 27 August 1991, Parliament adopts the Declaration of Independence from the USSR.',
    },
    detail: {
      ro: 'Declarația consfințește numele oficial în limba română și limba rusă.',
      ru: 'Декларация закрепляет официальные названия на румынском и русском.',
      en: 'The declaration affirms official Romanian and Russian names.',
    },
  },
  {
    id: 'evt-constitution-1994',
    year: 1994,
    era: 'contemporary',
    image: timelineThumbUrls.bank,
    relatedExhibitIds: ['exhibit-stamp-tax'],
    title: {
      ro: 'Constituția Republicii Moldova',
      ru: 'Конституция Республики Молдова',
      en: 'Constitution of the Republic of Moldova',
    },
    summary: {
      ro: 'La 29 iulie 1994 intră în vigoare Constituția statului modern — cadru pentru instituții și drepturi.',
      ru: '29 июля 1994 года вступает в силу Конституция современного государства.',
      en: 'On 29 July 1994, the constitution of the modern state enters into force.',
    },
    detail: {
      ro: 'Adoptată prin referendum, Constituția din 1994 definește Republica Moldova ca stat suveran.',
      ru: 'Принятая на референдуме Конституция 1994 года определяет Республику Молдова.',
      en: 'Adopted by referendum, the 1994 constitution defines the Republic of Moldova.',
    },
  },
]

export const seedQuizSets: QuizSet[] = [
  {
    id: 'quiz-balti-urban',
    passThreshold: 3,
    title: { ro: 'Bălți urban: piețe și străzi', ru: 'Бельцы: рынки и улицы', en: 'Bălți urban: markets and streets' },
    questions: [
      {
        id: 'q-b-1',
        prompt: {
          ro: 'Ce reper documentar timpuriu este frecvent citat pentru târgul de la Bălți?',
          ru: 'Какой ранний документальный ориентир часто приводят для ярмарки в Бельцах?',
          en: 'Which early documentary milestone is often cited for the Bălți fair?',
        },
        choices: [
          { ro: '1588', ru: '1588', en: '1588' },
          { ro: '1711', ru: '1711', en: '1711' },
          { ro: '1812', ru: '1812', en: '1812' },
          { ro: '1918', ru: '1918', en: '1918' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Anul 1588 apare frecvent în cronologiile locale ca primă atestare documentară a târgului.',
          ru: '1588 год часто упоминается в местных хрониках как первое документальное свидетельство ярмарки.',
          en: 'Local chronicles often cite 1588 as the first documentary mention of the fair.',
        },
      },
      {
        id: 'q-b-2',
        prompt: {
          ro: 'Care râu traversează municipiul Bălți?',
          ru: 'Какая река протекает через Бельцы?',
          en: 'Which river runs through the city of Bălți?',
        },
        choices: [
          { ro: 'Nistrul', ru: 'Днестр', en: 'The Dniester' },
          { ro: 'Răut', ru: 'Реут', en: 'The Răut' },
          { ro: 'Prutul', ru: 'Прут', en: 'The Prut' },
          { ro: 'Dunărea', ru: 'Дунай', en: 'The Danube' },
        ],
        correctIndex: 1,
        explanation: {
          ro: 'Râul Răut traversează municipiul Bălți.',
          ru: 'Река Реут протекает через Бельцы.',
          en: 'The Răut river flows through Bălți.',
        },
      },
      {
        id: 'q-b-3',
        prompt: {
          ro: 'Ce eveniment din 1812 a inclus Basarabia în Imperiul Rus?',
          ru: 'Какое событие 1812 года включило Бессарабию в Российскую империю?',
          en: 'Which 1812 event placed Bessarabia under Russian rule?',
        },
        choices: [
          { ro: 'Tratatul de la București', ru: 'Бухарестский мир', en: 'Treaty of Bucharest' },
          { ro: 'Pacea de la Paris', ru: 'Парижский мир', en: 'Peace of Paris' },
          { ro: 'Congresul de la Viena', ru: 'Венский конгресс', en: 'Congress of Vienna' },
          { ro: 'Unirea din 1859', ru: 'Объединение 1859', en: 'Union of 1859' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Tratatul de la București din 1812 consfințește anexarea estului Moldovei la Rusia.',
          ru: 'Бухарестский трактат 1812 года закрепил переход Молдавии к России.',
          en: 'The 1812 Treaty of Bucharest confirms Russia\'s annexation of eastern Moldavia.',
        },
      },
      {
        id: 'q-b-4',
        prompt: {
          ro: 'Unde se află Piața Independenței din Bălți?',
          ru: 'Где находится площадь Независимости в Бельцах?',
          en: 'Where is Independence Square located in Bălți?',
        },
        choices: [
          { ro: 'În centrul istoric', ru: 'В историческом центре', en: 'In the historic centre' },
          { ro: 'La periferia de est', ru: 'На восточной окраине', en: 'On the eastern outskirts' },
          { ro: 'În afara orașului', ru: 'За городом', en: 'Outside the city' },
          { ro: 'Numai pe hărți vechi', ru: 'Только на старых картах', en: 'Only on old maps' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Piața Independenței este nodul central al Bălților.',
          ru: 'Площадь Независимости — центральный узел Бельц.',
          en: 'Independence Square is Bălți\'s central hub.',
        },
      },
      {
        id: 'q-b-5',
        prompt: {
          ro: 'Catedrala Sf. Nicolae din Bălți aparține tradiției:',
          ru: 'Собор Св. Николая в Бельцах относится к:',
          en: 'St. Nicholas Cathedral in Bălți belongs to the:',
        },
        choices: [
          { ro: 'Ortodoxă', ru: 'Православие', en: 'Eastern Orthodox' },
          { ro: 'Catolicism latin', ru: 'Латинский католицизм', en: 'Latin Catholic' },
          { ro: 'Luterană', ru: 'Лютеранство', en: 'Lutheran' },
          { ro: 'Anglicană', ru: 'Англиканство', en: 'Anglican' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Majoritatea creștinilor din Moldova aparține Bisericii Ortodoxe.',
          ru: 'Большинство христиан Молдовы — православные.',
          en: 'Moldova\'s majority Christian community is Eastern Orthodox.',
        },
      },
    ],
  },
  {
    id: 'quiz-region',
    passThreshold: 3,
    title: { ro: 'Regiunea Prut–Nistru', ru: 'Регион между Прутом и Днестром', en: 'The Prut–Dniester region' },
    questions: [
      {
        id: 'q-r-1',
        prompt: {
          ro: 'Care este capitala Republicii Moldova?',
          ru: 'Какова столица Республики Молдова?',
          en: 'What is the capital of the Republic of Moldova?',
        },
        choices: [
          { ro: 'Chișinău', ru: 'Кишинёв', en: 'Chișinău' },
          { ro: 'Bălți', ru: 'Бельцы', en: 'Bălți' },
          { ro: 'Tiraspol', ru: 'Тирасполь', en: 'Tiraspol' },
          { ro: 'Iași', ru: 'Яссы', en: 'Iași' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Chișinău este capitala Republicii Moldova.',
          ru: 'Кишинёв — столица Молдовы.',
          en: 'Chișinău is the capital of Moldova.',
        },
      },
      {
        id: 'q-r-2',
        prompt: {
          ro: 'Limba română face parte din familia:',
          ru: 'Румынский язык относится к семье:',
          en: 'Romanian belongs to which language family?',
        },
        choices: [
          { ro: 'Limbi romanice', ru: 'Романские языки', en: 'Romance languages' },
          { ro: 'Limbi slave', ru: 'Славянские языки', en: 'Slavic languages' },
          { ro: 'Limbi germanice', ru: 'Германские языки', en: 'Germanic languages' },
          { ro: 'Limbi semitice', ru: 'Семитские языки', en: 'Semitic languages' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Româna a evoluat din latina populară — ramura romanică.',
          ru: 'Румынский произошёл из народной латыни — романская ветвь.',
          en: 'Romanian evolved from Vulgar Latin — the Romance branch.',
        },
      },
      {
        id: 'q-r-3',
        prompt: {
          ro: 'Moneda oficială a Republicii Moldova este:',
          ru: 'Официальная валюта Молдовы:',
          en: 'The official currency of Moldova is:',
        },
        choices: [
          { ro: 'MDL (leul moldovenesc)', ru: 'MDL (молдавский лей)', en: 'MDL (Moldovan leu)' },
          { ro: 'RON (leul românesc)', ru: 'RON (румынский лей)', en: 'RON (Romanian leu)' },
          { ro: 'UAH (hrivna)', ru: 'UAH (гривна)', en: 'UAH (hryvnia)' },
          { ro: 'EUR (euro)', ru: 'EUR (евро)', en: 'EUR (euro)' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Leul moldovenesc (MDL) este moneda emisă de Banca Națională a Moldovei.',
          ru: 'Молдавский лей (MDL) выпускается Национальным банком Молдовы.',
          en: 'The Moldovan leu (MDL) is issued by the National Bank of Moldova.',
        },
      },
      {
        id: 'q-r-4',
        prompt: {
          ro: 'Marea cea mai apropiată de sud-vestul Moldovei este:',
          ru: 'Ближайшее море к юго-западу Молдовы:',
          en: 'The sea closest to south-western Moldova is:',
        },
        choices: [
          { ro: 'Marea Neagră', ru: 'Чёрное море', en: 'The Black Sea' },
          { ro: 'Marea Baltică', ru: 'Балтийское море', en: 'The Baltic Sea' },
          { ro: 'Marea Caspică', ru: 'Каспийское море', en: 'The Caspian Sea' },
          { ro: 'Marea Mediterană', ru: 'Средиземное море', en: 'The Mediterranean Sea' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'Spre sud-vest, prin România și Ucraina, cel mai aproape este Marea Neagră.',
          ru: 'К юго-западу через соседей ближе всего Чёрное море.',
          en: 'Toward the south-west, the nearest sea is the Black Sea.',
        },
      },
      {
        id: 'q-r-5',
        prompt: {
          ro: 'Basarabia a făcut parte din România între:',
          ru: 'Бессарабия входила в Румынию между:',
          en: 'Bessarabia was part of Romania between:',
        },
        choices: [
          { ro: '1918 și 1940', ru: '1918 и 1940', en: '1918 and 1940' },
          { ro: '1812 și 1918', ru: '1812 и 1918', en: '1812 and 1918' },
          { ro: '1945 și 1991', ru: '1945 и 1991', en: '1945 and 1991' },
          { ro: '1588 și 1812', ru: '1588 и 1812', en: '1588 and 1812' },
        ],
        correctIndex: 0,
        explanation: {
          ro: 'După 1918 și până la ultimatumul din 1940.',
          ru: 'После 1918 и до событий 1940 года.',
          en: 'After the 1918 vote until the events of 1940.',
        },
      },
    ],
  },
]

export const seedBadges: BadgeDefinition[] = [
  {
    id: 'badge:time-rail',
    icon: '🛤️',
    title: { ro: 'Maestru al șinelului temporal', ru: 'Мастер временной ленты', en: 'Timeline rail master' },
    description: {
      ro: 'Ai deschis toate fișele evenimentelor din cronologia expoziției.',
      ru: 'Вы открыли все карточки событий на временной шкале.',
      en: 'You opened every timeline event card in the exhibit chronology.',
    },
  },
  {
    id: 'badge:chronologist',
    icon: '🧭',
    title: { ro: 'Cronolog', ru: 'Хронолог', en: 'Chronologist' },
    description: {
      ro: 'Ai ordonat corect misiunea „Anii în șir".',
      ru: 'Вы правильно упорядочили миссию «Годы по порядку».',
      en: 'You correctly completed the "Years in order" mission.',
    },
  },
  {
    id: 'badge:urban-quiz',
    icon: '🏛️',
    title: { ro: 'Explorator urban', ru: 'Городской исследователь', en: 'Urban explorer' },
    description: {
      ro: 'Ai obținut cel puțin 3/5 la quiz-ul despre Bălți.',
      ru: 'Вы набрали минимум 3/5 в викторине о Бельцах.',
      en: 'You scored at least 3/5 on the Bălți urban quiz.',
    },
  },
  {
    id: 'badge:region-quiz',
    icon: '🌍',
    title: { ro: 'Cartograf al regiunii', ru: 'Картограф региона', en: 'Regional cartographer' },
    description: {
      ro: 'Ai obținut cel puțin 3/5 la quiz-ul regional.',
      ru: 'Вы набрали минимум 3/5 в региональной викторине.',
      en: 'You scored at least 3/5 on the regional quiz.',
    },
  },
  {
    id: 'badge:match-master',
    icon: '🎴',
    title: { ro: 'Memorie de muzeu', ru: 'Музейная память', en: 'Museum memory' },
    description: {
      ro: 'Ai potrivit toate perechile din jocul de memorie.',
      ru: 'Вы собрали все пары в игре на память.',
      en: 'You matched every pair in the memory game.',
    },
  },
]

export function defaultMuseumSeed(): {
  halls: Hall[]
  exhibits: Exhibit[]
  people: HistoricalPerson[]
  timelineEvents: TimelineEvent[]
  quizSets: QuizSet[]
  badges: BadgeDefinition[]
} {
  return {
    halls: structuredClone(seedHalls),
    exhibits: structuredClone(seedExhibits),
    people: structuredClone(seedPeople),
    timelineEvents: structuredClone(seedTimelineEvents),
    quizSets: structuredClone(seedQuizSets),
    badges: structuredClone(seedBadges),
  }
}
