import type { MatchEvent, MatchJersey, MatchLineup, MatchOfficials, MatchScore, MatchStatus } from "../types";

type MockMatchDetails = {
  status?: MatchStatus;
  score?: MatchScore;
  events?: MatchEvent[];
  lineups?: {
    home?: Partial<MatchLineup>;
    away?: Partial<MatchLineup>;
  };
  officials?: MatchOfficials;
  jerseys?: MatchJersey[];
};

const germanyStartingXI = [
  { number: 1, name: "Manuel Neuer", position: "GK" },
  { number: 2, name: "Joshua Kimmich", position: "RB" },
  { number: 4, name: "Jonathan Tah", position: "CB" },
  { number: 15, name: "Nico Schlotterbeck", position: "CB" },
  { number: 18, name: "David Raum", position: "LB" },
  { number: 6, name: "Aleksandar Pavlovic", position: "DM" },
  { number: 8, name: "Leon Goretzka", position: "CM" },
  { number: 10, name: "Jamal Musiala", position: "AM" },
  { number: 17, name: "Florian Wirtz", position: "AM" },
  { number: 19, name: "Leroy Sane", position: "RW" },
  { number: 9, name: "Niclas Fullkrug", position: "ST" },
];

const germanySubstitutes = [
  { number: 12, name: "Oliver Baumann", position: "GK" },
  { number: 3, name: "Robin Gosens", position: "LB" },
  { number: 5, name: "Waldemar Anton", position: "CB" },
  { number: 7, name: "Serge Gnabry", position: "RW" },
  { number: 11, name: "Kai Havertz", position: "ST" },
  { number: 20, name: "Benjamin Henrichs", position: "RB" },
];

export const mockMatchDetails: Record<string, MockMatchDetails> = {
  m1: {
    status: "finished",
    score: { home: 2, away: 0 },
    events: [
      { id: "m1-e1", minute: "9'", type: "goal", team: "home", player: "Julian Quinones", detail: "首开纪录" },
      { id: "m1-e2", minute: "16'", type: "yellow-card", team: "away", player: "Teboho Mokoena", detail: "鲁莽犯规" },
      { id: "m1-e3", minute: "22'", type: "yellow-card", team: "home", player: "Brian Gutierrez", detail: "战术犯规" },
      { id: "m1-e4", minute: "50'", type: "red-card", team: "away", player: "Sphephelo Sithole", detail: "破坏明显得分机会" },
      { id: "m1-e5", minute: "67'", type: "goal", team: "home", player: "Raul Jimenez", detail: "头球扩大比分" },
      { id: "m1-e6", minute: "73'", type: "yellow-card", team: "away", player: "Nkosinathi Sibisi", detail: "鲁莽犯规" },
      { id: "m1-e7", minute: "84'", type: "red-card", team: "away", player: "Themba Zwane", detail: "VAR 判定暴力行为" },
      { id: "m1-e8", minute: "90+3'", type: "red-card", team: "home", player: "Cesar Montes", detail: "阻止南非反击" },
    ],
    lineups: {
      home: {
        formation: "4-3-3",
        startingXI: [
          { number: 13, name: "Guillermo Ochoa", position: "GK" },
          { number: 3, name: "Cesar Montes", position: "CB" },
          { number: 4, name: "Edson Alvarez", position: "DM" },
          { number: 14, name: "Erick Gutierrez", position: "CM" },
          { number: 22, name: "Hirving Lozano", position: "RW" },
        ],
        substitutes: [
          { number: 9, name: "Raul Jimenez", position: "ST" },
          { number: 18, name: "Luis Chavez", position: "CM" },
          { number: 20, name: "Jorge Sanchez", position: "RB" },
        ],
      },
      away: {
        formation: "4-2-3-1",
        startingXI: [
          { number: 1, name: "Ronwen Williams", position: "GK" },
          { number: 6, name: "Aubrey Modiba", position: "LB" },
          { number: 4, name: "Teboho Mokoena", position: "CM" },
          { number: 11, name: "Themba Zwane", position: "AM" },
          { number: 17, name: "Lyle Foster", position: "ST" },
        ],
        substitutes: [
          { number: 8, name: "Sphephelo Sithole", position: "CM" },
          { number: 19, name: "Evidence Makgopa", position: "ST" },
          { number: 21, name: "Thapelo Morena", position: "RB" },
        ],
      },
    },
    officials: {
      referee: "Cesar Arturo Ramos",
      assistantReferees: ["Alberto Morin", "Marco Bisguerra"],
      fourthOfficial: "Said Martinez",
      var: "Armando Villarreal",
      avar: "Tatiana Guzman",
    },
  },
  m2: {
    status: "finished",
    score: { home: 2, away: 1 },
    events: [
      { id: "m2-e1", minute: "59'", type: "goal", team: "away", player: "Ladislav Krejci", detail: "头球破门" },
      { id: "m2-e2", minute: "67'", type: "goal", team: "home", player: "Hwang In-beom", detail: "扳平比分" },
      { id: "m2-e3", minute: "80'", type: "goal", team: "home", player: "Oh Hyeon-gyu", detail: "替补制胜球" },
    ],
    lineups: {
      home: {
        formation: "3-4-3",
        startingXI: [
          { number: 1, name: "Kim Seung-gyu", position: "GK" },
          { number: 3, name: "Lee Gi-hyuk", position: "CB" },
          { number: 4, name: "Kim Min-jae", position: "CB" },
          { number: 2, name: "Lee Han-beom", position: "CB" },
          { number: 22, name: "Seol Young-woo", position: "RWB" },
          { number: 6, name: "Hwang In-beom", position: "CM" },
          { number: 8, name: "Paik Seung-ho", position: "CM" },
          { number: 13, name: "Lee Tae-seok", position: "LWB" },
          { number: 19, name: "Lee Kang-in", position: "RW" },
          { number: 10, name: "Lee Jae-sung", position: "FW" },
          { number: 7, name: "Son Heung-min", position: "LW" },
        ],
        substitutes: [
          { number: "-", name: "Hwang Hee-chan", position: "LW" },
          { number: "-", name: "Oh Hyeon-gyu", position: "ST" },
          { number: "-", name: "Eom Ji-sung", position: "LW" },
        ],
      },
      away: {
        formation: "3-4-3",
        startingXI: [
          { number: 1, name: "Matej Kovar", position: "GK" },
          { number: 6, name: "Stepan Chaloupek", position: "CB" },
          { number: 4, name: "Robin Hranac", position: "CB" },
          { number: 7, name: "Ladislav Krejci", position: "CB" },
          { number: 5, name: "Vladimir Coufal", position: "RWB" },
          { number: 22, name: "Tomas Soucek", position: "CM" },
          { number: 24, name: "Alexandr Sojka", position: "CM" },
          { number: 20, name: "Jaroslav Zeleny", position: "LWB" },
          { number: 17, name: "Lukas Provod", position: "LW" },
          { number: 15, name: "Pavel Sulc", position: "FW" },
          { number: 10, name: "Patrik Schick", position: "ST" },
        ],
        substitutes: [
          { number: "-", name: "Adam Hlozek", position: "FW" },
          { number: "-", name: "Tomas Chory", position: "ST" },
          { number: "-", name: "Michal Sadilek", position: "CM" },
          { number: "-", name: "Mojmir Chytil", position: "ST" },
        ],
      },
    },
    officials: {
      referee: "Amin Mohamed Omar",
      assistantReferees: [],
    },
  },
  m10: {
    status: "scheduled",
    score: { home: null, away: null },
    events: [
      { id: "m10-e1", minute: "赛前", type: "note", team: "home", player: "Jamal Musiala", detail: "德国队关键前场持球点" },
      { id: "m10-e2", minute: "赛前", type: "note", team: "home", player: "Joshua Kimmich", detail: "定位球与右路组织重点" },
    ],
    lineups: {
      home: {
        formation: "4-2-3-1",
        startingXI: germanyStartingXI,
        substitutes: germanySubstitutes,
      },
      away: {
        formation: "4-3-3",
        startingXI: [
          { number: 1, name: "Eloy Room", position: "GK" },
          { number: 3, name: "Sherel Floranus", position: "RB" },
          { number: 8, name: "Leandro Bacuna", position: "CM" },
          { number: 10, name: "Juninho Bacuna", position: "AM" },
          { number: 11, name: "Brandley Kuwas", position: "RW" },
        ],
        substitutes: [
          { number: 12, name: "Tyrick Bodak", position: "GK" },
          { number: 17, name: "Jeremy Antonisse", position: "LW" },
          { number: 20, name: "Gervane Kastaneer", position: "ST" },
        ],
      },
    },
    officials: {
      referee: "Francois Letexier",
      assistantReferees: ["Cyril Mugnier", "Mehdi Rahmouni"],
      fourthOfficial: "Glenn Nyberg",
      var: "Jerome Brisard",
      avar: "Bastian Dankert",
    },
  },
};
