export type PlayerImage = {
  src: string;
  sourceUrl: string;
  license: string;
  credit: string;
};

const officialBayernImage = (imagePath: string): string =>
  `https://img.fcbayern.com/image/upload/f_auto/q_auto/ar_1%3A1%2Cc_fill%2Cg_custom%2Cw_768/${imagePath}`;

const officialBayernLicense =
  "FC Bayern official player portrait, rights reserved; remote image reference only";

const officialBayernCredit = "FC Bayern München AG";

export const playerImages: Record<string, PlayerImage> = {
  "Jamal Musiala": {
    src: officialBayernImage(
      "v1778845185/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/Musiala_Campus_light.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/jamal-musiala",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Joshua Kimmich": {
    src: officialBayernImage(
      "v1656614911/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/joshua_kimmich.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/joshua-kimmich",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Manuel Neuer": {
    src: officialBayernImage(
      "v1719763484/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/manuel_neuer.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/manuel-neuer",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Harry Kane": {
    src: officialBayernImage(
      "v1691827799/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/harry-kane.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/harry-kane",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Dayot Upamecano": {
    src: officialBayernImage(
      "v1656614772/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/dayot_upamecano.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/dayot-upamecano",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Michael Olise": {
    src: officialBayernImage(
      "v1726228393/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/michael-olise.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/michael-olise",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Alphonso Davies": {
    src: officialBayernImage(
      "v1656615722/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/alphonso_davies.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/alphonso-davies",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Jonathan Tah": {
    src: officialBayernImage(
      "v1756462914/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/jonathan-tah.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/jonathan-tah",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Hiroki Ito": {
    src: officialBayernImage(
      "v1718361788/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/hiroki-ito.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/hiroki-ito",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Nicolas Jackson": {
    src: officialBayernImage(
      "v1756760031/cms/public/images/fcbayern-com/players/spielerportraits/teaser/nicolas-jackson.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/nicolas-jackson",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Josip Stanisic": {
    src: officialBayernImage(
      "v1778846333/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/Stanisic_Campus_light.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/josip-stani%C5%A1i%C4%87",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Josip Stanišić": {
    src: officialBayernImage(
      "v1778846333/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/Stanisic_Campus_light.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/josip-stani%C5%A1i%C4%87",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Luis Diaz": {
    src: officialBayernImage(
      "v1753859302/cms/public/images/fcbayern-com/players/spielerportraits/teaser/luis-diaz.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/luis-diaz",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Luis Díaz": {
    src: officialBayernImage(
      "v1753859302/cms/public/images/fcbayern-com/players/spielerportraits/teaser/luis-diaz.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/luis-diaz",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Kim Min-jae": {
    src: officialBayernImage(
      "v1689695039/cms/public/images/fcbayern-com/players/spielerportraits/teaser/minjae-kim.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/minjae-kim",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Minjae Kim": {
    src: officialBayernImage(
      "v1689695039/cms/public/images/fcbayern-com/players/spielerportraits/teaser/minjae-kim.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/minjae-kim",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
  "Konrad Laimer": {
    src: officialBayernImage(
      "v1686144311/cms/public/images/fcbayern-com/players/spielerportraits/ganzkoerper/konrad-laimer.png",
    ),
    sourceUrl: "https://fcbayern.com/en/teams/first-team/konrad-laimer",
    license: officialBayernLicense,
    credit: officialBayernCredit,
  },
};

export const getPlayerImage = (playerName: string): PlayerImage | undefined =>
  playerImages[playerName];
