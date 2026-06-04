export type PlayerImage = {
  src: string;
  sourceUrl: string;
  license: string;
  credit: string;
};

export const playerImages: Record<string, PlayerImage> = {
  "Jamal Musiala": {
    src: "/player-images/jamal-musiala.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jamal_Musiala_2022.jpg",
    license: "CC BY-SA 4.0",
    credit: "Steffen Prößdorf / cropped by Commons contributors",
  },
  "Joshua Kimmich": {
    src: "/player-images/joshua-kimmich.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2015-05-01_Joshua_Kimmich.jpg",
    license: "CC BY-SA 4.0",
    credit: "Wikijunkie",
  },
  "Leroy Sané": {
    src: "/player-images/leroy-sane.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Leroy_Sane_S04_2015.jpg",
    license: "CC BY 2.0",
    credit: "Daniel Kraski",
  },
  "Serge Gnabry": {
    src: "/player-images/serge-gnabry.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Serge_Gnabry_(10834583033).jpg",
    license: "CC BY 2.0",
    credit: "Kieran Clarke",
  },
  "Manuel Neuer": {
    src: "/player-images/manuel-neuer.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Manuel_Neuer_2012_(cropped).jpg",
    license: "CC BY-SA 3.0",
    credit: "Michael Kranewitter",
  },
  "Harry Kane": {
    src: "/player-images/harry-kane.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Harry_Kane_2023.jpg",
    license: "CC BY 2.0",
    credit: "Simon Walker / No 10 Downing Street",
  },
  "Dayot Upamecano": {
    src: "/player-images/dayot-upamecano.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FC_Red_Bull_Salzburg_gegen_Bayern_M%C3%BCnchen_(2025-01-06_Testspiel)_02.jpg",
    license: "CC BY-SA 4.0",
    credit: "Werner100359",
  },
  "Michael Olise": {
    src: "/player-images/michael-olise.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FC_RB_Salzburg_gegen_FC_Bayern_M%C3%BCnchen_(2026-01-06_Testspiel)_10.jpg",
    license: "CC BY-SA 4.0",
    credit: "Commons contributor",
  },
  "Kingsley Coman": {
    src: "/player-images/kingsley-coman.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kingsley_Coman_(2019).jpg",
    license: "CC BY-SA 4.0",
    credit: "Sven Mandel",
  },
  "Alphonso Davies": {
    src: "/player-images/alphonso-davies.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Alphonso_Davies_2018.jpg",
    license: "CC BY 2.0",
    credit: "Chris McPhee",
  },
  "Jonathan Tah": {
    src: "/player-images/jonathan-tah.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jonathan-Tah.jpg",
    license: "CC BY-SA 3.0",
    credit: "Fuguito",
  },
  "Hiroki Ito": {
    src: "/player-images/hiroki-ito.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hiroki_Ito_VfB_Stuttgart.jpg",
    license: "CC BY 3.0 / GFDL",
    credit: "Jeollo von VfB-exklusiv.de",
  },
  "Nicolas Jackson": {
    src: "/player-images/nicolas-jackson.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nicolas_Jackson_20042025_(1).jpg",
    license: "CC0 1.0",
    credit: "Timmy96",
  },
  "Josip Stanisic": {
    src: "/player-images/josip-stanisic.png",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Josip_Stani%C5%A1i%C4%87_during_an_Interview_in_2023.png",
    license: "CC BY 3.0",
    credit: "PIXSELL",
  },
  "Luis Diaz": {
    src: "/player-images/luis-diaz.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Luis_Diaz_2022.jpg",
    license: "CC BY-SA 4.0",
    credit: "Dudek1337",
  },
  "Kim Min-jae": {
    src: "/player-images/kim-min-jae.png",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Min-Jae_Kim_(2021-22_S%C3%BCper_Lig)_-_Resim6.png",
    license: "CC BY 3.0",
    credit: "beIN SPORTS Türkiye",
  },
  "Konrad Laimer": {
    src: "/player-images/konrad-laimer.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:20161011_U21_AUT_GER_9254.jpg",
    license: "CC BY-SA 3.0",
    credit: "Ailura",
  },
};

export const getPlayerImage = (playerName: string): PlayerImage | undefined =>
  playerImages[playerName];
