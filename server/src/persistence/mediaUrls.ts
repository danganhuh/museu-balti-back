/** Same Commons URLs as `src/data/remoteMedia.ts` (duplicated for API seed). */

export const hallCoverUrls = {
  oldBalti:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/B%C4%83l%C8%9Bi-vedere_dinspre_sud-vest.jpg/960px-B%C4%83l%C8%9Bi-vedere_dinspre_sud-vest.jpg',
  crafts:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Covor_oltenesc.jpg/960px-Covor_oltenesc.jpg',
  coins: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Edward_III_noble.jpg',
  faces:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Str._%C8%98tefan_cel_Mare_din_B%C4%83l%C8%9Bi.JPG/960px-Str._%C8%98tefan_cel_Mare_din_B%C4%83l%C8%9Bi.JPG',
} as const

export const exhibitHeroUrls = {
  marketSquare:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Pia%C8%9Ba_Independen%C8%9Bei_din_B%C4%83l%C8%9Bi_3.JPG/960px-Pia%C8%9Ba_Independen%C8%9Bei_din_B%C4%83l%C8%9Bi_3.JPG',
  streetFacade: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Banca_romaneasca%2C_Balti.jpg',
  courtyardWell:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Colopotni%C8%9Ba_%28Catd._Sf._Nicolae%2C_BL%29.jpg/960px-Colopotni%C8%9Ba_%28Catd._Sf._Nicolae%2C_BL%29.jpg',
  weaverLoom:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Loom_haute_lisse_DSC08774.jpg/960px-Loom_haute_lisse_DSC08774.jpg',
  potteryKiln:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pottery_kiln_archmus_Eretria_19558.jpg/960px-Pottery_kiln_archmus_Eretria_19558.jpg',
  prutCoins: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Edward_III_noble.jpg',
  stampTax:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Stamp._USSR._Revenue_stamps_of_the_Soviet_Union._img_02.jpg/960px-Stamp._USSR._Revenue_stamps_of_the_Soviet_Union._img_02.jpg',
  lettersStage:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Paramount_Theatre_Seating_View_%28empty%29.jpg/960px-Paramount_Theatre_Seating_View_%28empty%29.jpg',
  schoolPhoto:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Hohenloher_Freilandmuseum_-_Schulhaus_aus_Satteldorf_-_Studenti_vintage_%2813604852043%29.jpg/960px-Hohenloher_Freilandmuseum_-_Schulhaus_aus_Satteldorf_-_Studenti_vintage_%2813604852043%29.jpg',
} as const

export const portraitUrls = {
  alecsandri:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Vasile_Alecsandri_-_Foto_02.jpg/440px-Vasile_Alecsandri_-_Foto_02.jpg',
  architectPlans: exhibitHeroUrls.streetFacade,
  merchantCoins: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Chisinau_Piata_Centrala.JPG',
} as const

export const timelineThumbUrls = {
  fair: exhibitHeroUrls.marketSquare,
  rail: exhibitHeroUrls.prutCoins,
  street: hallCoverUrls.faces,
  stamp: exhibitHeroUrls.stampTax,
  flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/330px-Flag_of_Moldova.svg.png',
  bank: exhibitHeroUrls.streetFacade,
} as const
