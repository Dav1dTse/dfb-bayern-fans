import type { Fixture } from "../types";

// 数据来源：../德拜指南/德拜球迷世界杯赛程指南_德国时间.docx
// 生成口径：完整赛程表 104 场 + 逐日观看指南的关注等级、拜仁球员和观看理由。
// kickoffUtc 由文档中的北京时间换算为 UTC，便于页面按用户时区实时显示和导出 ICS。
export const fixtures: Fixture[] = [
  {
    "id": "m1",
    "matchNumber": "M1",
    "competition": "2026 FIFA World Cup",
    "stage": "小组A组",
    "homeTeam": "墨西哥",
    "awayTeam": "南非",
    "kickoffUtc": "2026-06-11T19:00:00Z",
    "venue": "Estadio Azteca",
    "city": "Mexico City",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M1",
      "小组A组",
      "2026-06-12 周五 03:00",
      "柏林时间 06-11 周四 21:00"
    ],
    "sourceBeijingTime": "2026-06-12 周五 03:00",
    "sourceBerlinTime": "06-11 周四 21:00",
    "watchReason": ""
  },
  {
    "id": "m2",
    "matchNumber": "M2",
    "competition": "2026 FIFA World Cup",
    "stage": "小组A组",
    "homeTeam": "韩国",
    "awayTeam": "捷克",
    "kickoffUtc": "2026-06-12T02:00:00Z",
    "venue": "Estadio Akron",
    "city": "Guadalajara",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Kim Min-jae",
        "country": "韩国",
        "shirtNumber": 3,
        "role": "CB"
      }
    ],
    "tags": [
      "M2",
      "小组A组",
      "2026-06-12 周五 10:00",
      "柏林时间 06-12 周五 04:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-12 周五 10:00",
    "sourceBerlinTime": "06-12 周五 04:00",
    "watchReason": "韩国首战，看金玟哉稳不稳。"
  },
  {
    "id": "m3",
    "matchNumber": "M3",
    "competition": "2026 FIFA World Cup",
    "stage": "小组B组",
    "homeTeam": "加拿大",
    "awayTeam": "波黑",
    "kickoffUtc": "2026-06-12T19:00:00Z",
    "venue": "BMO Field",
    "city": "Toronto",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Alphonso Davies",
        "country": "加拿大",
        "shirtNumber": 19,
        "role": "LB"
      }
    ],
    "tags": [
      "M3",
      "小组B组",
      "2026-06-13 周六 03:00",
      "柏林时间 06-12 周五 21:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-13 周六 03:00",
    "sourceBerlinTime": "06-12 周五 21:00",
    "watchReason": "Davies 首战，看速度和左路推进。"
  },
  {
    "id": "m4",
    "matchNumber": "M4",
    "competition": "2026 FIFA World Cup",
    "stage": "小组D组",
    "homeTeam": "美国",
    "awayTeam": "巴拉圭",
    "kickoffUtc": "2026-06-13T01:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M4",
      "小组D组",
      "2026-06-13 周六 09:00",
      "柏林时间 06-13 周六 03:00"
    ],
    "sourceBeijingTime": "2026-06-13 周六 09:00",
    "sourceBerlinTime": "06-13 周六 03:00",
    "watchReason": ""
  },
  {
    "id": "m8",
    "matchNumber": "M8",
    "competition": "2026 FIFA World Cup",
    "stage": "小组B组",
    "homeTeam": "卡塔尔",
    "awayTeam": "瑞士",
    "kickoffUtc": "2026-06-13T19:00:00Z",
    "venue": "Levi's Stadium",
    "city": "Santa Clara",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M8",
      "小组B组",
      "2026-06-14 周日 03:00",
      "柏林时间 06-13 周六 21:00"
    ],
    "sourceBeijingTime": "2026-06-14 周日 03:00",
    "sourceBerlinTime": "06-13 周六 21:00",
    "watchReason": ""
  },
  {
    "id": "m7",
    "matchNumber": "M7",
    "competition": "2026 FIFA World Cup",
    "stage": "小组C组",
    "homeTeam": "巴西",
    "awayTeam": "摩洛哥",
    "kickoffUtc": "2026-06-13T22:00:00Z",
    "venue": "Gillette Stadium",
    "city": "Foxborough",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M7",
      "小组C组",
      "2026-06-14 周日 06:00",
      "柏林时间 06-14 周日 00:00",
      "普通焦点"
    ],
    "sourceBeijingTime": "2026-06-14 周日 06:00",
    "sourceBerlinTime": "06-14 周日 00:00",
    "watchReason": "普通焦点：传统强队焦点战。"
  },
  {
    "id": "m5",
    "matchNumber": "M5",
    "competition": "2026 FIFA World Cup",
    "stage": "小组C组",
    "homeTeam": "海地",
    "awayTeam": "苏格兰",
    "kickoffUtc": "2026-06-14T01:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M5",
      "小组C组",
      "2026-06-14 周日 09:00",
      "柏林时间 06-14 周日 03:00"
    ],
    "sourceBeijingTime": "2026-06-14 周日 09:00",
    "sourceBerlinTime": "06-14 周日 03:00",
    "watchReason": ""
  },
  {
    "id": "m6",
    "matchNumber": "M6",
    "competition": "2026 FIFA World Cup",
    "stage": "小组D组",
    "homeTeam": "澳大利亚",
    "awayTeam": "土耳其",
    "kickoffUtc": "2026-06-14T04:00:00Z",
    "venue": "BC Place",
    "city": "Vancouver",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M6",
      "小组D组",
      "2026-06-14 周日 12:00",
      "柏林时间 06-14 周日 06:00"
    ],
    "sourceBeijingTime": "2026-06-14 周日 12:00",
    "sourceBerlinTime": "06-14 周日 06:00",
    "watchReason": ""
  },
  {
    "id": "m10",
    "matchNumber": "M10",
    "competition": "2026 FIFA World Cup",
    "stage": "小组E组",
    "homeTeam": "德国",
    "awayTeam": "库拉索",
    "kickoffUtc": "2026-06-14T17:00:00Z",
    "venue": "NRG Stadium",
    "city": "Houston",
    "importance": "must-watch",
    "relatedToGermany": true,
    "relatedBayernPlayers": [
      {
        "name": "Joshua Kimmich",
        "country": "德国",
        "shirtNumber": 6,
        "role": "DM"
      },
      {
        "name": "Jamal Musiala",
        "country": "德国",
        "shirtNumber": 10,
        "role": "AM"
      },
      {
        "name": "Manuel Neuer",
        "country": "德国",
        "shirtNumber": 1,
        "role": "GK"
      },
      {
        "name": "Jonathan Tah",
        "country": "德国",
        "shirtNumber": 4,
        "role": "CB"
      }
    ],
    "tags": [
      "M10",
      "小组E组",
      "2026-06-15 周一 01:00",
      "柏林时间 06-14 周日 19:00",
      "德国队",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-15 周一 01:00",
    "sourceBerlinTime": "06-14 周日 19:00",
    "watchReason": "德国首战，看中场结构、Musiala 状态和 Neuer。"
  },
  {
    "id": "m11",
    "matchNumber": "M11",
    "competition": "2026 FIFA World Cup",
    "stage": "小组F组",
    "homeTeam": "荷兰",
    "awayTeam": "日本",
    "kickoffUtc": "2026-06-14T20:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Hiroki Ito",
        "country": "日本",
        "shirtNumber": 21,
        "role": "DF"
      }
    ],
    "tags": [
      "M11",
      "小组F组",
      "2026-06-15 周一 04:00",
      "柏林时间 06-14 周日 22:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-15 周一 04:00",
    "sourceBerlinTime": "06-14 周日 22:00",
    "watchReason": "日本碰荷兰，Ito 防守压力不小。"
  },
  {
    "id": "m9",
    "matchNumber": "M9",
    "competition": "2026 FIFA World Cup",
    "stage": "小组E组",
    "homeTeam": "科特迪瓦",
    "awayTeam": "厄瓜多尔",
    "kickoffUtc": "2026-06-14T23:00:00Z",
    "venue": "Lincoln Financial Field",
    "city": "Philadelphia",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M9",
      "小组E组",
      "2026-06-15 周一 07:00",
      "柏林时间 06-15 周一 01:00"
    ],
    "sourceBeijingTime": "2026-06-15 周一 07:00",
    "sourceBerlinTime": "06-15 周一 01:00",
    "watchReason": ""
  },
  {
    "id": "m12",
    "matchNumber": "M12",
    "competition": "2026 FIFA World Cup",
    "stage": "小组F组",
    "homeTeam": "瑞典",
    "awayTeam": "突尼斯",
    "kickoffUtc": "2026-06-15T02:00:00Z",
    "venue": "Estadio BBVA",
    "city": "Monterrey",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M12",
      "小组F组",
      "2026-06-15 周一 10:00",
      "柏林时间 06-15 周一 04:00"
    ],
    "sourceBeijingTime": "2026-06-15 周一 10:00",
    "sourceBerlinTime": "06-15 周一 04:00",
    "watchReason": ""
  },
  {
    "id": "m14",
    "matchNumber": "M14",
    "competition": "2026 FIFA World Cup",
    "stage": "小组H组",
    "homeTeam": "西班牙",
    "awayTeam": "佛得角",
    "kickoffUtc": "2026-06-15T16:00:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M14",
      "小组H组",
      "2026-06-16 周二 00:00",
      "柏林时间 06-15 周一 18:00",
      "普通焦点"
    ],
    "sourceBeijingTime": "2026-06-16 周二 00:00",
    "sourceBerlinTime": "06-15 周一 18:00",
    "watchReason": "普通焦点：传统强队焦点战。"
  },
  {
    "id": "m16",
    "matchNumber": "M16",
    "competition": "2026 FIFA World Cup",
    "stage": "小组G组",
    "homeTeam": "比利时",
    "awayTeam": "埃及",
    "kickoffUtc": "2026-06-15T19:00:00Z",
    "venue": "Lumen Field",
    "city": "Seattle",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M16",
      "小组G组",
      "2026-06-16 周二 03:00",
      "柏林时间 06-15 周一 21:00"
    ],
    "sourceBeijingTime": "2026-06-16 周二 03:00",
    "sourceBerlinTime": "06-15 周一 21:00",
    "watchReason": ""
  },
  {
    "id": "m13",
    "matchNumber": "M13",
    "competition": "2026 FIFA World Cup",
    "stage": "小组H组",
    "homeTeam": "沙特阿拉伯",
    "awayTeam": "乌拉圭",
    "kickoffUtc": "2026-06-15T22:00:00Z",
    "venue": "Hard Rock Stadium",
    "city": "Miami Gardens",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M13",
      "小组H组",
      "2026-06-16 周二 06:00",
      "柏林时间 06-16 周二 00:00"
    ],
    "sourceBeijingTime": "2026-06-16 周二 06:00",
    "sourceBerlinTime": "06-16 周二 00:00",
    "watchReason": ""
  },
  {
    "id": "m15",
    "matchNumber": "M15",
    "competition": "2026 FIFA World Cup",
    "stage": "小组G组",
    "homeTeam": "伊朗",
    "awayTeam": "新西兰",
    "kickoffUtc": "2026-06-16T01:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M15",
      "小组G组",
      "2026-06-16 周二 09:00",
      "柏林时间 06-16 周二 03:00"
    ],
    "sourceBeijingTime": "2026-06-16 周二 09:00",
    "sourceBerlinTime": "06-16 周二 03:00",
    "watchReason": ""
  },
  {
    "id": "m17",
    "matchNumber": "M17",
    "competition": "2026 FIFA World Cup",
    "stage": "小组I组",
    "homeTeam": "法国",
    "awayTeam": "塞内加尔",
    "kickoffUtc": "2026-06-16T19:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "must-watch",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Michael Olise",
        "country": "法国",
        "shirtNumber": 7,
        "role": "RW"
      },
      {
        "name": "Dayot Upamecano",
        "country": "法国",
        "shirtNumber": 2,
        "role": "CB"
      },
      {
        "name": "Nicolas Jackson",
        "country": "塞内加尔",
        "shirtNumber": 15,
        "role": "ST"
      }
    ],
    "tags": [
      "M17",
      "小组I组",
      "2026-06-17 周三 03:00",
      "柏林时间 06-16 周二 21:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-17 周三 03:00",
    "sourceBerlinTime": "06-16 周二 21:00",
    "watchReason": "法国 vs 塞内加尔，拜仁相关性极高。"
  },
  {
    "id": "m18",
    "matchNumber": "M18",
    "competition": "2026 FIFA World Cup",
    "stage": "小组I组",
    "homeTeam": "伊拉克",
    "awayTeam": "挪威",
    "kickoffUtc": "2026-06-16T22:00:00Z",
    "venue": "Gillette Stadium",
    "city": "Foxborough",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M18",
      "小组I组",
      "2026-06-17 周三 06:00",
      "柏林时间 06-17 周三 00:00"
    ],
    "sourceBeijingTime": "2026-06-17 周三 06:00",
    "sourceBerlinTime": "06-17 周三 00:00",
    "watchReason": ""
  },
  {
    "id": "m19",
    "matchNumber": "M19",
    "competition": "2026 FIFA World Cup",
    "stage": "小组J组",
    "homeTeam": "阿根廷",
    "awayTeam": "阿尔及利亚",
    "kickoffUtc": "2026-06-17T01:00:00Z",
    "venue": "Arrowhead Stadium",
    "city": "Kansas City",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M19",
      "小组J组",
      "2026-06-17 周三 09:00",
      "柏林时间 06-17 周三 03:00"
    ],
    "sourceBeijingTime": "2026-06-17 周三 09:00",
    "sourceBerlinTime": "06-17 周三 03:00",
    "watchReason": ""
  },
  {
    "id": "m20",
    "matchNumber": "M20",
    "competition": "2026 FIFA World Cup",
    "stage": "小组J组",
    "homeTeam": "奥地利",
    "awayTeam": "约旦",
    "kickoffUtc": "2026-06-17T04:00:00Z",
    "venue": "Levi's Stadium",
    "city": "Santa Clara",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Konrad Laimer",
        "country": "奥地利",
        "shirtNumber": 27,
        "role": "CM"
      }
    ],
    "tags": [
      "M20",
      "小组J组",
      "2026-06-17 周三 12:00",
      "柏林时间 06-17 周三 06:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-17 周三 12:00",
    "sourceBerlinTime": "06-17 周三 06:00",
    "watchReason": "Laimer 首战，看奥地利逼抢强度。"
  },
  {
    "id": "m23",
    "matchNumber": "M23",
    "competition": "2026 FIFA World Cup",
    "stage": "小组K组",
    "homeTeam": "葡萄牙",
    "awayTeam": "刚果民主共和国",
    "kickoffUtc": "2026-06-17T17:00:00Z",
    "venue": "NRG Stadium",
    "city": "Houston",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M23",
      "小组K组",
      "2026-06-18 周四 01:00",
      "柏林时间 06-17 周三 19:00"
    ],
    "sourceBeijingTime": "2026-06-18 周四 01:00",
    "sourceBerlinTime": "06-17 周三 19:00",
    "watchReason": ""
  },
  {
    "id": "m22",
    "matchNumber": "M22",
    "competition": "2026 FIFA World Cup",
    "stage": "小组L组",
    "homeTeam": "英格兰",
    "awayTeam": "克罗地亚",
    "kickoffUtc": "2026-06-17T20:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "must-watch",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Harry Kane",
        "country": "英格兰",
        "shirtNumber": 9,
        "role": "ST"
      },
      {
        "name": "Josip Stanisic",
        "country": "克罗地亚",
        "shirtNumber": 2,
        "role": "DF"
      }
    ],
    "tags": [
      "M22",
      "小组L组",
      "2026-06-18 周四 04:00",
      "柏林时间 06-17 周三 22:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-18 周四 04:00",
    "sourceBerlinTime": "06-17 周三 22:00",
    "watchReason": "Kane 对 Stanisic，拜仁直接对话。"
  },
  {
    "id": "m21",
    "matchNumber": "M21",
    "competition": "2026 FIFA World Cup",
    "stage": "小组L组",
    "homeTeam": "加纳",
    "awayTeam": "巴拿马",
    "kickoffUtc": "2026-06-17T23:00:00Z",
    "venue": "BMO Field",
    "city": "Toronto",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M21",
      "小组L组",
      "2026-06-18 周四 07:00",
      "柏林时间 06-18 周四 01:00"
    ],
    "sourceBeijingTime": "2026-06-18 周四 07:00",
    "sourceBerlinTime": "06-18 周四 01:00",
    "watchReason": ""
  },
  {
    "id": "m24",
    "matchNumber": "M24",
    "competition": "2026 FIFA World Cup",
    "stage": "小组K组",
    "homeTeam": "乌兹别克斯坦",
    "awayTeam": "哥伦比亚",
    "kickoffUtc": "2026-06-18T02:00:00Z",
    "venue": "Estadio Azteca",
    "city": "Mexico City",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Luis Diaz",
        "country": "哥伦比亚",
        "shirtNumber": 7,
        "role": "LW"
      }
    ],
    "tags": [
      "M24",
      "小组K组",
      "2026-06-18 周四 10:00",
      "柏林时间 06-18 周四 04:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-18 周四 10:00",
    "sourceBerlinTime": "06-18 周四 04:00",
    "watchReason": "Diaz 首战，看哥伦比亚左路爆点。"
  },
  {
    "id": "m25",
    "matchNumber": "M25",
    "competition": "2026 FIFA World Cup",
    "stage": "小组A组",
    "homeTeam": "捷克",
    "awayTeam": "南非",
    "kickoffUtc": "2026-06-18T16:00:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M25",
      "小组A组",
      "2026-06-19 周五 00:00",
      "柏林时间 06-18 周四 18:00"
    ],
    "sourceBeijingTime": "2026-06-19 周五 00:00",
    "sourceBerlinTime": "06-18 周四 18:00",
    "watchReason": ""
  },
  {
    "id": "m26",
    "matchNumber": "M26",
    "competition": "2026 FIFA World Cup",
    "stage": "小组B组",
    "homeTeam": "瑞士",
    "awayTeam": "波黑",
    "kickoffUtc": "2026-06-18T19:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M26",
      "小组B组",
      "2026-06-19 周五 03:00",
      "柏林时间 06-18 周四 21:00"
    ],
    "sourceBeijingTime": "2026-06-19 周五 03:00",
    "sourceBerlinTime": "06-18 周四 21:00",
    "watchReason": ""
  },
  {
    "id": "m27",
    "matchNumber": "M27",
    "competition": "2026 FIFA World Cup",
    "stage": "小组B组",
    "homeTeam": "加拿大",
    "awayTeam": "卡塔尔",
    "kickoffUtc": "2026-06-18T22:00:00Z",
    "venue": "BC Place",
    "city": "Vancouver",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Alphonso Davies",
        "country": "加拿大",
        "shirtNumber": 19,
        "role": "LB"
      }
    ],
    "tags": [
      "M27",
      "小组B组",
      "2026-06-19 周五 06:00",
      "柏林时间 06-19 周五 00:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-19 周五 06:00",
    "sourceBerlinTime": "06-19 周五 00:00",
    "watchReason": "加拿大第二战，Davies 应是推进核心。"
  },
  {
    "id": "m28",
    "matchNumber": "M28",
    "competition": "2026 FIFA World Cup",
    "stage": "小组A组",
    "homeTeam": "墨西哥",
    "awayTeam": "韩国",
    "kickoffUtc": "2026-06-19T01:00:00Z",
    "venue": "Estadio Akron",
    "city": "Guadalajara",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Kim Min-jae",
        "country": "韩国",
        "shirtNumber": 3,
        "role": "CB"
      }
    ],
    "tags": [
      "M28",
      "小组A组",
      "2026-06-19 周五 09:00",
      "柏林时间 06-19 周五 03:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-19 周五 09:00",
    "sourceBerlinTime": "06-19 周五 03:00",
    "watchReason": "韩国对墨西哥，金玟哉面对更强冲击。"
  },
  {
    "id": "m32",
    "matchNumber": "M32",
    "competition": "2026 FIFA World Cup",
    "stage": "小组D组",
    "homeTeam": "美国",
    "awayTeam": "澳大利亚",
    "kickoffUtc": "2026-06-19T19:00:00Z",
    "venue": "Lumen Field",
    "city": "Seattle",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M32",
      "小组D组",
      "2026-06-20 周六 03:00",
      "柏林时间 06-19 周五 21:00"
    ],
    "sourceBeijingTime": "2026-06-20 周六 03:00",
    "sourceBerlinTime": "06-19 周五 21:00",
    "watchReason": ""
  },
  {
    "id": "m30",
    "matchNumber": "M30",
    "competition": "2026 FIFA World Cup",
    "stage": "小组C组",
    "homeTeam": "苏格兰",
    "awayTeam": "摩洛哥",
    "kickoffUtc": "2026-06-19T22:00:00Z",
    "venue": "Lincoln Financial Field",
    "city": "Philadelphia",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M30",
      "小组C组",
      "2026-06-20 周六 06:00",
      "柏林时间 06-20 周六 00:00"
    ],
    "sourceBeijingTime": "2026-06-20 周六 06:00",
    "sourceBerlinTime": "06-20 周六 00:00",
    "watchReason": ""
  },
  {
    "id": "m29",
    "matchNumber": "M29",
    "competition": "2026 FIFA World Cup",
    "stage": "小组C组",
    "homeTeam": "巴西",
    "awayTeam": "海地",
    "kickoffUtc": "2026-06-20T00:30:00Z",
    "venue": "Gillette Stadium",
    "city": "Foxborough",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M29",
      "小组C组",
      "2026-06-20 周六 08:30",
      "柏林时间 06-20 周六 02:30"
    ],
    "sourceBeijingTime": "2026-06-20 周六 08:30",
    "sourceBerlinTime": "06-20 周六 02:30",
    "watchReason": ""
  },
  {
    "id": "m31",
    "matchNumber": "M31",
    "competition": "2026 FIFA World Cup",
    "stage": "小组D组",
    "homeTeam": "土耳其",
    "awayTeam": "巴拉圭",
    "kickoffUtc": "2026-06-20T03:00:00Z",
    "venue": "Levi's Stadium",
    "city": "Santa Clara",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M31",
      "小组D组",
      "2026-06-20 周六 11:00",
      "柏林时间 06-20 周六 05:00"
    ],
    "sourceBeijingTime": "2026-06-20 周六 11:00",
    "sourceBerlinTime": "06-20 周六 05:00",
    "watchReason": ""
  },
  {
    "id": "m35",
    "matchNumber": "M35",
    "competition": "2026 FIFA World Cup",
    "stage": "小组F组",
    "homeTeam": "荷兰",
    "awayTeam": "瑞典",
    "kickoffUtc": "2026-06-20T17:00:00Z",
    "venue": "NRG Stadium",
    "city": "Houston",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M35",
      "小组F组",
      "2026-06-21 周日 01:00",
      "柏林时间 06-20 周六 19:00"
    ],
    "sourceBeijingTime": "2026-06-21 周日 01:00",
    "sourceBerlinTime": "06-20 周六 19:00",
    "watchReason": ""
  },
  {
    "id": "m33",
    "matchNumber": "M33",
    "competition": "2026 FIFA World Cup",
    "stage": "小组E组",
    "homeTeam": "德国",
    "awayTeam": "科特迪瓦",
    "kickoffUtc": "2026-06-20T20:00:00Z",
    "venue": "BMO Field",
    "city": "Toronto",
    "importance": "must-watch",
    "relatedToGermany": true,
    "relatedBayernPlayers": [
      {
        "name": "Joshua Kimmich",
        "country": "德国",
        "shirtNumber": 6,
        "role": "DM"
      },
      {
        "name": "Jamal Musiala",
        "country": "德国",
        "shirtNumber": 10,
        "role": "AM"
      },
      {
        "name": "Manuel Neuer",
        "country": "德国",
        "shirtNumber": 1,
        "role": "GK"
      },
      {
        "name": "Jonathan Tah",
        "country": "德国",
        "shirtNumber": 4,
        "role": "CB"
      }
    ],
    "tags": [
      "M33",
      "小组E组",
      "2026-06-21 周日 04:00",
      "柏林时间 06-20 周六 22:00",
      "德国队",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-21 周日 04:00",
    "sourceBerlinTime": "06-20 周六 22:00",
    "watchReason": "德国第二战，小组走势会更清楚。"
  },
  {
    "id": "m34",
    "matchNumber": "M34",
    "competition": "2026 FIFA World Cup",
    "stage": "小组E组",
    "homeTeam": "厄瓜多尔",
    "awayTeam": "库拉索",
    "kickoffUtc": "2026-06-21T00:00:00Z",
    "venue": "Arrowhead Stadium",
    "city": "Kansas City",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M34",
      "小组E组",
      "2026-06-21 周日 08:00",
      "柏林时间 06-21 周日 02:00"
    ],
    "sourceBeijingTime": "2026-06-21 周日 08:00",
    "sourceBerlinTime": "06-21 周日 02:00",
    "watchReason": ""
  },
  {
    "id": "m36",
    "matchNumber": "M36",
    "competition": "2026 FIFA World Cup",
    "stage": "小组F组",
    "homeTeam": "突尼斯",
    "awayTeam": "日本",
    "kickoffUtc": "2026-06-21T04:00:00Z",
    "venue": "Estadio BBVA",
    "city": "Monterrey",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Hiroki Ito",
        "country": "日本",
        "shirtNumber": 21,
        "role": "DF"
      }
    ],
    "tags": [
      "M36",
      "小组F组",
      "2026-06-21 周日 12:00",
      "柏林时间 06-21 周日 06:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-21 周日 12:00",
    "sourceBerlinTime": "06-21 周日 06:00",
    "watchReason": "日本对突尼斯，Ito 的推进和防守转换值得看。"
  },
  {
    "id": "m38",
    "matchNumber": "M38",
    "competition": "2026 FIFA World Cup",
    "stage": "小组H组",
    "homeTeam": "西班牙",
    "awayTeam": "沙特阿拉伯",
    "kickoffUtc": "2026-06-21T16:00:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M38",
      "小组H组",
      "2026-06-22 周一 00:00",
      "柏林时间 06-21 周日 18:00",
      "普通焦点"
    ],
    "sourceBeijingTime": "2026-06-22 周一 00:00",
    "sourceBerlinTime": "06-21 周日 18:00",
    "watchReason": "普通焦点：传统强队焦点战。"
  },
  {
    "id": "m39",
    "matchNumber": "M39",
    "competition": "2026 FIFA World Cup",
    "stage": "小组G组",
    "homeTeam": "比利时",
    "awayTeam": "伊朗",
    "kickoffUtc": "2026-06-21T19:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M39",
      "小组G组",
      "2026-06-22 周一 03:00",
      "柏林时间 06-21 周日 21:00",
      "普通焦点"
    ],
    "sourceBeijingTime": "2026-06-22 周一 03:00",
    "sourceBerlinTime": "06-21 周日 21:00",
    "watchReason": "普通焦点：传统强队焦点战。"
  },
  {
    "id": "m37",
    "matchNumber": "M37",
    "competition": "2026 FIFA World Cup",
    "stage": "小组H组",
    "homeTeam": "乌拉圭",
    "awayTeam": "佛得角",
    "kickoffUtc": "2026-06-21T22:00:00Z",
    "venue": "Hard Rock Stadium",
    "city": "Miami Gardens",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M37",
      "小组H组",
      "2026-06-22 周一 06:00",
      "柏林时间 06-22 周一 00:00"
    ],
    "sourceBeijingTime": "2026-06-22 周一 06:00",
    "sourceBerlinTime": "06-22 周一 00:00",
    "watchReason": ""
  },
  {
    "id": "m40",
    "matchNumber": "M40",
    "competition": "2026 FIFA World Cup",
    "stage": "小组G组",
    "homeTeam": "新西兰",
    "awayTeam": "埃及",
    "kickoffUtc": "2026-06-22T01:00:00Z",
    "venue": "BC Place",
    "city": "Vancouver",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M40",
      "小组G组",
      "2026-06-22 周一 09:00",
      "柏林时间 06-22 周一 03:00"
    ],
    "sourceBeijingTime": "2026-06-22 周一 09:00",
    "sourceBerlinTime": "06-22 周一 03:00",
    "watchReason": ""
  },
  {
    "id": "m43",
    "matchNumber": "M43",
    "competition": "2026 FIFA World Cup",
    "stage": "小组J组",
    "homeTeam": "阿根廷",
    "awayTeam": "奥地利",
    "kickoffUtc": "2026-06-22T17:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Konrad Laimer",
        "country": "奥地利",
        "shirtNumber": 27,
        "role": "CM"
      }
    ],
    "tags": [
      "M43",
      "小组J组",
      "2026-06-23 周二 01:00",
      "柏林时间 06-22 周一 19:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-23 周二 01:00",
    "sourceBerlinTime": "06-22 周一 19:00",
    "watchReason": "Laimer 对阿根廷，防守强度会被放大。"
  },
  {
    "id": "m42",
    "matchNumber": "M42",
    "competition": "2026 FIFA World Cup",
    "stage": "小组I组",
    "homeTeam": "法国",
    "awayTeam": "伊拉克",
    "kickoffUtc": "2026-06-22T21:00:00Z",
    "venue": "Lincoln Financial Field",
    "city": "Philadelphia",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Michael Olise",
        "country": "法国",
        "shirtNumber": 7,
        "role": "RW"
      },
      {
        "name": "Dayot Upamecano",
        "country": "法国",
        "shirtNumber": 2,
        "role": "CB"
      }
    ],
    "tags": [
      "M42",
      "小组I组",
      "2026-06-23 周二 05:00",
      "柏林时间 06-22 周一 23:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-23 周二 05:00",
    "sourceBerlinTime": "06-22 周一 23:00",
    "watchReason": "法国第二战，看 Olise 主力节奏。"
  },
  {
    "id": "m41",
    "matchNumber": "M41",
    "competition": "2026 FIFA World Cup",
    "stage": "小组I组",
    "homeTeam": "挪威",
    "awayTeam": "塞内加尔",
    "kickoffUtc": "2026-06-23T00:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Nicolas Jackson",
        "country": "塞内加尔",
        "shirtNumber": 15,
        "role": "ST"
      }
    ],
    "tags": [
      "M41",
      "小组I组",
      "2026-06-23 周二 08:00",
      "柏林时间 06-23 周二 02:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-23 周二 08:00",
    "sourceBerlinTime": "06-23 周二 02:00",
    "watchReason": "塞内加尔对挪威，Jackson 与 Haaland 同场有话题性。"
  },
  {
    "id": "m44",
    "matchNumber": "M44",
    "competition": "2026 FIFA World Cup",
    "stage": "小组J组",
    "homeTeam": "约旦",
    "awayTeam": "阿尔及利亚",
    "kickoffUtc": "2026-06-23T03:00:00Z",
    "venue": "Levi's Stadium",
    "city": "Santa Clara",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M44",
      "小组J组",
      "2026-06-23 周二 11:00",
      "柏林时间 06-23 周二 05:00"
    ],
    "sourceBeijingTime": "2026-06-23 周二 11:00",
    "sourceBerlinTime": "06-23 周二 05:00",
    "watchReason": ""
  },
  {
    "id": "m47",
    "matchNumber": "M47",
    "competition": "2026 FIFA World Cup",
    "stage": "小组K组",
    "homeTeam": "葡萄牙",
    "awayTeam": "乌兹别克斯坦",
    "kickoffUtc": "2026-06-23T17:00:00Z",
    "venue": "NRG Stadium",
    "city": "Houston",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M47",
      "小组K组",
      "2026-06-24 周三 01:00",
      "柏林时间 06-23 周二 19:00",
      "普通焦点"
    ],
    "sourceBeijingTime": "2026-06-24 周三 01:00",
    "sourceBerlinTime": "06-23 周二 19:00",
    "watchReason": "普通焦点：传统强队焦点战。"
  },
  {
    "id": "m45",
    "matchNumber": "M45",
    "competition": "2026 FIFA World Cup",
    "stage": "小组L组",
    "homeTeam": "英格兰",
    "awayTeam": "加纳",
    "kickoffUtc": "2026-06-23T20:00:00Z",
    "venue": "Gillette Stadium",
    "city": "Foxborough",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Harry Kane",
        "country": "英格兰",
        "shirtNumber": 9,
        "role": "ST"
      }
    ],
    "tags": [
      "M45",
      "小组L组",
      "2026-06-24 周三 04:00",
      "柏林时间 06-23 周二 22:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-24 周三 04:00",
    "sourceBerlinTime": "06-23 周二 22:00",
    "watchReason": "Kane 第二战，看英格兰进攻效率。"
  },
  {
    "id": "m46",
    "matchNumber": "M46",
    "competition": "2026 FIFA World Cup",
    "stage": "小组L组",
    "homeTeam": "巴拿马",
    "awayTeam": "克罗地亚",
    "kickoffUtc": "2026-06-23T23:00:00Z",
    "venue": "BMO Field",
    "city": "Toronto",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Josip Stanisic",
        "country": "克罗地亚",
        "shirtNumber": 2,
        "role": "DF"
      }
    ],
    "tags": [
      "M46",
      "小组L组",
      "2026-06-24 周三 07:00",
      "柏林时间 06-24 周三 01:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-24 周三 07:00",
    "sourceBerlinTime": "06-24 周三 01:00",
    "watchReason": "Stanisic 面对巴拿马，克罗地亚后场轮换观察。"
  },
  {
    "id": "m48",
    "matchNumber": "M48",
    "competition": "2026 FIFA World Cup",
    "stage": "小组K组",
    "homeTeam": "哥伦比亚",
    "awayTeam": "刚果民主共和国",
    "kickoffUtc": "2026-06-24T02:00:00Z",
    "venue": "Estadio Akron",
    "city": "Guadalajara",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Luis Diaz",
        "country": "哥伦比亚",
        "shirtNumber": 7,
        "role": "LW"
      }
    ],
    "tags": [
      "M48",
      "小组K组",
      "2026-06-24 周三 10:00",
      "柏林时间 06-24 周三 04:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-24 周三 10:00",
    "sourceBerlinTime": "06-24 周三 04:00",
    "watchReason": "哥伦比亚第二战，Diaz 的边路影响力继续观察。"
  },
  {
    "id": "m51",
    "matchNumber": "M51",
    "competition": "2026 FIFA World Cup",
    "stage": "小组B组",
    "homeTeam": "瑞士",
    "awayTeam": "加拿大",
    "kickoffUtc": "2026-06-24T19:00:00Z",
    "venue": "BC Place",
    "city": "Vancouver",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Alphonso Davies",
        "country": "加拿大",
        "shirtNumber": 19,
        "role": "LB"
      }
    ],
    "tags": [
      "M51",
      "小组B组",
      "2026-06-25 周四 03:00",
      "柏林时间 06-24 周三 21:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-25 周四 03:00",
    "sourceBerlinTime": "06-24 周三 21:00",
    "watchReason": "Davies 面对成熟欧洲体系。"
  },
  {
    "id": "m52",
    "matchNumber": "M52",
    "competition": "2026 FIFA World Cup",
    "stage": "小组B组",
    "homeTeam": "波黑",
    "awayTeam": "卡塔尔",
    "kickoffUtc": "2026-06-24T19:00:00Z",
    "venue": "Lumen Field",
    "city": "Seattle",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M52",
      "小组B组",
      "2026-06-25 周四 03:00",
      "柏林时间 06-24 周三 21:00"
    ],
    "sourceBeijingTime": "2026-06-25 周四 03:00",
    "sourceBerlinTime": "06-24 周三 21:00",
    "watchReason": ""
  },
  {
    "id": "m49",
    "matchNumber": "M49",
    "competition": "2026 FIFA World Cup",
    "stage": "小组C组",
    "homeTeam": "苏格兰",
    "awayTeam": "巴西",
    "kickoffUtc": "2026-06-24T22:00:00Z",
    "venue": "Hard Rock Stadium",
    "city": "Miami Gardens",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M49",
      "小组C组",
      "2026-06-25 周四 06:00",
      "柏林时间 06-25 周四 00:00",
      "普通焦点"
    ],
    "sourceBeijingTime": "2026-06-25 周四 06:00",
    "sourceBerlinTime": "06-25 周四 00:00",
    "watchReason": "普通焦点：传统强队焦点战。"
  },
  {
    "id": "m50",
    "matchNumber": "M50",
    "competition": "2026 FIFA World Cup",
    "stage": "小组C组",
    "homeTeam": "摩洛哥",
    "awayTeam": "海地",
    "kickoffUtc": "2026-06-24T22:00:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M50",
      "小组C组",
      "2026-06-25 周四 06:00",
      "柏林时间 06-25 周四 00:00"
    ],
    "sourceBeijingTime": "2026-06-25 周四 06:00",
    "sourceBerlinTime": "06-25 周四 00:00",
    "watchReason": ""
  },
  {
    "id": "m53",
    "matchNumber": "M53",
    "competition": "2026 FIFA World Cup",
    "stage": "小组A组",
    "homeTeam": "捷克",
    "awayTeam": "墨西哥",
    "kickoffUtc": "2026-06-25T01:00:00Z",
    "venue": "Estadio Azteca",
    "city": "Mexico City",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M53",
      "小组A组",
      "2026-06-25 周四 09:00",
      "柏林时间 06-25 周四 03:00"
    ],
    "sourceBeijingTime": "2026-06-25 周四 09:00",
    "sourceBerlinTime": "06-25 周四 03:00",
    "watchReason": ""
  },
  {
    "id": "m54",
    "matchNumber": "M54",
    "competition": "2026 FIFA World Cup",
    "stage": "小组A组",
    "homeTeam": "南非",
    "awayTeam": "韩国",
    "kickoffUtc": "2026-06-25T01:00:00Z",
    "venue": "Estadio BBVA",
    "city": "Monterrey",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Kim Min-jae",
        "country": "韩国",
        "shirtNumber": 3,
        "role": "CB"
      }
    ],
    "tags": [
      "M54",
      "小组A组",
      "2026-06-25 周四 09:00",
      "柏林时间 06-25 周四 03:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-25 周四 09:00",
    "sourceBerlinTime": "06-25 周四 03:00",
    "watchReason": "韩国收官战，金玟哉可能直接影响出线。"
  },
  {
    "id": "m55",
    "matchNumber": "M55",
    "competition": "2026 FIFA World Cup",
    "stage": "小组E组",
    "homeTeam": "库拉索",
    "awayTeam": "科特迪瓦",
    "kickoffUtc": "2026-06-25T20:00:00Z",
    "venue": "Lincoln Financial Field",
    "city": "Philadelphia",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M55",
      "小组E组",
      "2026-06-26 周五 04:00",
      "柏林时间 06-25 周四 22:00"
    ],
    "sourceBeijingTime": "2026-06-26 周五 04:00",
    "sourceBerlinTime": "06-25 周四 22:00",
    "watchReason": ""
  },
  {
    "id": "m56",
    "matchNumber": "M56",
    "competition": "2026 FIFA World Cup",
    "stage": "小组E组",
    "homeTeam": "厄瓜多尔",
    "awayTeam": "德国",
    "kickoffUtc": "2026-06-25T20:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "must-watch",
    "relatedToGermany": true,
    "relatedBayernPlayers": [
      {
        "name": "Joshua Kimmich",
        "country": "德国",
        "shirtNumber": 6,
        "role": "DM"
      },
      {
        "name": "Jamal Musiala",
        "country": "德国",
        "shirtNumber": 10,
        "role": "AM"
      },
      {
        "name": "Manuel Neuer",
        "country": "德国",
        "shirtNumber": 1,
        "role": "GK"
      },
      {
        "name": "Jonathan Tah",
        "country": "德国",
        "shirtNumber": 4,
        "role": "CB"
      }
    ],
    "tags": [
      "M56",
      "小组E组",
      "2026-06-26 周五 04:00",
      "柏林时间 06-25 周四 22:00",
      "德国队",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-26 周五 04:00",
    "sourceBerlinTime": "06-25 周四 22:00",
    "watchReason": "德国收官战，可能决定淘汰赛路径。"
  },
  {
    "id": "m57",
    "matchNumber": "M57",
    "competition": "2026 FIFA World Cup",
    "stage": "小组F组",
    "homeTeam": "日本",
    "awayTeam": "瑞典",
    "kickoffUtc": "2026-06-25T23:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Hiroki Ito",
        "country": "日本",
        "shirtNumber": 21,
        "role": "DF"
      }
    ],
    "tags": [
      "M57",
      "小组F组",
      "2026-06-26 周五 07:00",
      "柏林时间 06-26 周五 01:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-26 周五 07:00",
    "sourceBerlinTime": "06-26 周五 01:00",
    "watchReason": "日本对瑞典，Ito 的对抗压力更高。"
  },
  {
    "id": "m58",
    "matchNumber": "M58",
    "competition": "2026 FIFA World Cup",
    "stage": "小组F组",
    "homeTeam": "突尼斯",
    "awayTeam": "荷兰",
    "kickoffUtc": "2026-06-25T23:00:00Z",
    "venue": "Arrowhead Stadium",
    "city": "Kansas City",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M58",
      "小组F组",
      "2026-06-26 周五 07:00",
      "柏林时间 06-26 周五 01:00"
    ],
    "sourceBeijingTime": "2026-06-26 周五 07:00",
    "sourceBerlinTime": "06-26 周五 01:00",
    "watchReason": ""
  },
  {
    "id": "m59",
    "matchNumber": "M59",
    "competition": "2026 FIFA World Cup",
    "stage": "小组D组",
    "homeTeam": "土耳其",
    "awayTeam": "美国",
    "kickoffUtc": "2026-06-26T02:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M59",
      "小组D组",
      "2026-06-26 周五 10:00",
      "柏林时间 06-26 周五 04:00"
    ],
    "sourceBeijingTime": "2026-06-26 周五 10:00",
    "sourceBerlinTime": "06-26 周五 04:00",
    "watchReason": ""
  },
  {
    "id": "m60",
    "matchNumber": "M60",
    "competition": "2026 FIFA World Cup",
    "stage": "小组D组",
    "homeTeam": "巴拉圭",
    "awayTeam": "澳大利亚",
    "kickoffUtc": "2026-06-26T02:00:00Z",
    "venue": "Levi's Stadium",
    "city": "Santa Clara",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M60",
      "小组D组",
      "2026-06-26 周五 10:00",
      "柏林时间 06-26 周五 04:00"
    ],
    "sourceBeijingTime": "2026-06-26 周五 10:00",
    "sourceBerlinTime": "06-26 周五 04:00",
    "watchReason": ""
  },
  {
    "id": "m61",
    "matchNumber": "M61",
    "competition": "2026 FIFA World Cup",
    "stage": "小组I组",
    "homeTeam": "挪威",
    "awayTeam": "法国",
    "kickoffUtc": "2026-06-26T19:00:00Z",
    "venue": "Gillette Stadium",
    "city": "Foxborough",
    "importance": "must-watch",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Michael Olise",
        "country": "法国",
        "shirtNumber": 7,
        "role": "RW"
      },
      {
        "name": "Dayot Upamecano",
        "country": "法国",
        "shirtNumber": 2,
        "role": "CB"
      }
    ],
    "tags": [
      "M61",
      "小组I组",
      "2026-06-27 周六 03:00",
      "柏林时间 06-26 周五 21:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-27 周六 03:00",
    "sourceBerlinTime": "06-26 周五 21:00",
    "watchReason": "挪威 vs 法国，Haaland 冲击后场。"
  },
  {
    "id": "m62",
    "matchNumber": "M62",
    "competition": "2026 FIFA World Cup",
    "stage": "小组I组",
    "homeTeam": "塞内加尔",
    "awayTeam": "伊拉克",
    "kickoffUtc": "2026-06-26T19:00:00Z",
    "venue": "BMO Field",
    "city": "Toronto",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Nicolas Jackson",
        "country": "塞内加尔",
        "shirtNumber": 15,
        "role": "ST"
      }
    ],
    "tags": [
      "M62",
      "小组I组",
      "2026-06-27 周六 03:00",
      "柏林时间 06-26 周五 21:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-27 周六 03:00",
    "sourceBerlinTime": "06-26 周五 21:00",
    "watchReason": "塞内加尔收官战，Jackson 可能争出线。"
  },
  {
    "id": "m65",
    "matchNumber": "M65",
    "competition": "2026 FIFA World Cup",
    "stage": "小组H组",
    "homeTeam": "佛得角",
    "awayTeam": "沙特阿拉伯",
    "kickoffUtc": "2026-06-27T00:00:00Z",
    "venue": "NRG Stadium",
    "city": "Houston",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M65",
      "小组H组",
      "2026-06-27 周六 08:00",
      "柏林时间 06-27 周六 02:00"
    ],
    "sourceBeijingTime": "2026-06-27 周六 08:00",
    "sourceBerlinTime": "06-27 周六 02:00",
    "watchReason": ""
  },
  {
    "id": "m66",
    "matchNumber": "M66",
    "competition": "2026 FIFA World Cup",
    "stage": "小组H组",
    "homeTeam": "乌拉圭",
    "awayTeam": "西班牙",
    "kickoffUtc": "2026-06-27T00:00:00Z",
    "venue": "Estadio Akron",
    "city": "Guadalajara",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M66",
      "小组H组",
      "2026-06-27 周六 08:00",
      "柏林时间 06-27 周六 02:00",
      "普通焦点"
    ],
    "sourceBeijingTime": "2026-06-27 周六 08:00",
    "sourceBerlinTime": "06-27 周六 02:00",
    "watchReason": "普通焦点：传统强队焦点战。"
  },
  {
    "id": "m63",
    "matchNumber": "M63",
    "competition": "2026 FIFA World Cup",
    "stage": "小组G组",
    "homeTeam": "埃及",
    "awayTeam": "伊朗",
    "kickoffUtc": "2026-06-27T03:00:00Z",
    "venue": "Lumen Field",
    "city": "Seattle",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M63",
      "小组G组",
      "2026-06-27 周六 11:00",
      "柏林时间 06-27 周六 05:00"
    ],
    "sourceBeijingTime": "2026-06-27 周六 11:00",
    "sourceBerlinTime": "06-27 周六 05:00",
    "watchReason": ""
  },
  {
    "id": "m64",
    "matchNumber": "M64",
    "competition": "2026 FIFA World Cup",
    "stage": "小组G组",
    "homeTeam": "新西兰",
    "awayTeam": "比利时",
    "kickoffUtc": "2026-06-27T03:00:00Z",
    "venue": "BC Place",
    "city": "Vancouver",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M64",
      "小组G组",
      "2026-06-27 周六 11:00",
      "柏林时间 06-27 周六 05:00"
    ],
    "sourceBeijingTime": "2026-06-27 周六 11:00",
    "sourceBerlinTime": "06-27 周六 05:00",
    "watchReason": ""
  },
  {
    "id": "m67",
    "matchNumber": "M67",
    "competition": "2026 FIFA World Cup",
    "stage": "小组L组",
    "homeTeam": "巴拿马",
    "awayTeam": "英格兰",
    "kickoffUtc": "2026-06-27T21:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Harry Kane",
        "country": "英格兰",
        "shirtNumber": 9,
        "role": "ST"
      }
    ],
    "tags": [
      "M67",
      "小组L组",
      "2026-06-28 周日 05:00",
      "柏林时间 06-27 周六 23:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-28 周日 05:00",
    "sourceBerlinTime": "06-27 周六 23:00",
    "watchReason": "英格兰收官战，Kane 状态和轮换都要看。"
  },
  {
    "id": "m68",
    "matchNumber": "M68",
    "competition": "2026 FIFA World Cup",
    "stage": "小组L组",
    "homeTeam": "克罗地亚",
    "awayTeam": "加纳",
    "kickoffUtc": "2026-06-27T21:00:00Z",
    "venue": "Lincoln Financial Field",
    "city": "Philadelphia",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Josip Stanisic",
        "country": "克罗地亚",
        "shirtNumber": 2,
        "role": "DF"
      }
    ],
    "tags": [
      "M68",
      "小组L组",
      "2026-06-28 周日 05:00",
      "柏林时间 06-27 周六 23:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-28 周日 05:00",
    "sourceBerlinTime": "06-27 周六 23:00",
    "watchReason": "克罗地亚收官战，Stanisic 与出线走势绑定。"
  },
  {
    "id": "m71",
    "matchNumber": "M71",
    "competition": "2026 FIFA World Cup",
    "stage": "小组K组",
    "homeTeam": "哥伦比亚",
    "awayTeam": "葡萄牙",
    "kickoffUtc": "2026-06-27T23:30:00Z",
    "venue": "Hard Rock Stadium",
    "city": "Miami Gardens",
    "importance": "must-watch",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Luis Diaz",
        "country": "哥伦比亚",
        "shirtNumber": 7,
        "role": "LW"
      }
    ],
    "tags": [
      "M71",
      "小组K组",
      "2026-06-28 周日 07:30",
      "柏林时间 06-28 周日 01:30",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-28 周日 07:30",
    "sourceBerlinTime": "06-28 周日 01:30",
    "watchReason": "Diaz 对葡萄牙，检验含金量。"
  },
  {
    "id": "m72",
    "matchNumber": "M72",
    "competition": "2026 FIFA World Cup",
    "stage": "小组K组",
    "homeTeam": "刚果民主共和国",
    "awayTeam": "乌兹别克斯坦",
    "kickoffUtc": "2026-06-27T23:30:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M72",
      "小组K组",
      "2026-06-28 周日 07:30",
      "柏林时间 06-28 周日 01:30"
    ],
    "sourceBeijingTime": "2026-06-28 周日 07:30",
    "sourceBerlinTime": "06-28 周日 01:30",
    "watchReason": ""
  },
  {
    "id": "m69",
    "matchNumber": "M69",
    "competition": "2026 FIFA World Cup",
    "stage": "小组J组",
    "homeTeam": "阿尔及利亚",
    "awayTeam": "奥地利",
    "kickoffUtc": "2026-06-28T02:00:00Z",
    "venue": "Arrowhead Stadium",
    "city": "Kansas City",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [
      {
        "name": "Konrad Laimer",
        "country": "奥地利",
        "shirtNumber": 27,
        "role": "CM"
      }
    ],
    "tags": [
      "M69",
      "小组J组",
      "2026-06-28 周日 10:00",
      "柏林时间 06-28 周日 04:00",
      "拜仁相关"
    ],
    "sourceBeijingTime": "2026-06-28 周日 10:00",
    "sourceBerlinTime": "06-28 周日 04:00",
    "watchReason": "奥地利收官战，Laimer 的中场硬度关键。"
  },
  {
    "id": "m70",
    "matchNumber": "M70",
    "competition": "2026 FIFA World Cup",
    "stage": "小组J组",
    "homeTeam": "约旦",
    "awayTeam": "阿根廷",
    "kickoffUtc": "2026-06-28T02:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M70",
      "小组J组",
      "2026-06-28 周日 10:00",
      "柏林时间 06-28 周日 04:00"
    ],
    "sourceBeijingTime": "2026-06-28 周日 10:00",
    "sourceBerlinTime": "06-28 周日 04:00",
    "watchReason": ""
  },
  {
    "id": "m73",
    "matchNumber": "M73",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "A组第二",
    "awayTeam": "B组第二",
    "kickoffUtc": "2026-06-28T19:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M73",
      "32强赛",
      "2026-06-29 周一 03:00",
      "柏林时间 06-28 周日 21:00"
    ],
    "sourceBeijingTime": "2026-06-29 周一 03:00",
    "sourceBerlinTime": "06-28 周日 21:00",
    "watchReason": ""
  },
  {
    "id": "m76",
    "matchNumber": "M76",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "C组第一",
    "awayTeam": "F组第二",
    "kickoffUtc": "2026-06-29T17:00:00Z",
    "venue": "NRG Stadium",
    "city": "Houston",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M76",
      "32强赛",
      "2026-06-30 周二 01:00",
      "柏林时间 06-29 周一 19:00"
    ],
    "sourceBeijingTime": "2026-06-30 周二 01:00",
    "sourceBerlinTime": "06-29 周一 19:00",
    "watchReason": ""
  },
  {
    "id": "m74",
    "matchNumber": "M74",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "E组第一",
    "awayTeam": "A/B/C/D/F组第三晋级队",
    "kickoffUtc": "2026-06-29T20:30:00Z",
    "venue": "Gillette Stadium",
    "city": "Foxborough",
    "importance": "must-watch",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M74",
      "32强赛",
      "2026-06-30 周二 04:30",
      "柏林时间 06-29 周一 22:30",
      "德国队"
    ],
    "sourceBeijingTime": "2026-06-30 周二 04:30",
    "sourceBerlinTime": "06-29 周一 22:30",
    "watchReason": "⭐ 必看 🌙 熬夜场 德国若 E 组第一：德国首场 32 强赛可能路径，赛后按实际对手更新。"
  },
  {
    "id": "m75",
    "matchNumber": "M75",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "F组第一",
    "awayTeam": "C组第二",
    "kickoffUtc": "2026-06-30T01:00:00Z",
    "venue": "Estadio BBVA",
    "city": "Monterrey",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M75",
      "32强赛",
      "2026-06-30 周二 09:00",
      "柏林时间 06-30 周二 03:00"
    ],
    "sourceBeijingTime": "2026-06-30 周二 09:00",
    "sourceBerlinTime": "06-30 周二 03:00",
    "watchReason": ""
  },
  {
    "id": "m78",
    "matchNumber": "M78",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "E组第二",
    "awayTeam": "I组第二",
    "kickoffUtc": "2026-06-30T17:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "must-watch",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M78",
      "32强赛",
      "2026-07-01 周三 01:00",
      "柏林时间 06-30 周二 19:00",
      "德国队"
    ],
    "sourceBeijingTime": "2026-07-01 周三 01:00",
    "sourceBerlinTime": "06-30 周二 19:00",
    "watchReason": "⭐ 必看 🌙 熬夜场 德国若 E 组第二：德国第二名路径，潜在法国/塞内加尔链路更有拜仁味。"
  },
  {
    "id": "m77",
    "matchNumber": "M77",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "I组第一",
    "awayTeam": "C/D/F/G/H组第三晋级队",
    "kickoffUtc": "2026-06-30T21:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M77",
      "32强赛",
      "2026-07-01 周三 05:00",
      "柏林时间 06-30 周二 23:00"
    ],
    "sourceBeijingTime": "2026-07-01 周三 05:00",
    "sourceBerlinTime": "06-30 周二 23:00",
    "watchReason": ""
  },
  {
    "id": "m79",
    "matchNumber": "M79",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "A组第一",
    "awayTeam": "C/E/F/H/I组第三晋级队",
    "kickoffUtc": "2026-07-01T01:00:00Z",
    "venue": "Estadio Azteca",
    "city": "Mexico City",
    "importance": "high",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M79",
      "32强赛",
      "2026-07-01 周三 09:00",
      "柏林时间 07-01 周三 03:00",
      "德国队",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-01 周三 09:00",
    "sourceBerlinTime": "07-01 周三 03:00",
    "watchReason": "🔄 淘汰赛待更新 德国若 E 组第三晋级可能路径之一：第三名分配赛后才确定。"
  },
  {
    "id": "m80",
    "matchNumber": "M80",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "L组第一",
    "awayTeam": "E/H/I/J/K组第三晋级队",
    "kickoffUtc": "2026-07-01T16:00:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "high",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M80",
      "32强赛",
      "2026-07-02 周四 00:00",
      "柏林时间 07-01 周三 18:00",
      "德国队",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-02 周四 00:00",
    "sourceBerlinTime": "07-01 周三 18:00",
    "watchReason": "🔄 淘汰赛待更新 德国若 E 组第三晋级可能路径之一：第三名分配赛后才确定。"
  },
  {
    "id": "m82",
    "matchNumber": "M82",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "G组第一",
    "awayTeam": "A/E/H/I/J组第三晋级队",
    "kickoffUtc": "2026-07-01T20:00:00Z",
    "venue": "Lumen Field",
    "city": "Seattle",
    "importance": "high",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M82",
      "32强赛",
      "2026-07-02 周四 04:00",
      "柏林时间 07-01 周三 22:00",
      "德国队",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-02 周四 04:00",
    "sourceBerlinTime": "07-01 周三 22:00",
    "watchReason": "🔄 淘汰赛待更新 德国若 E 组第三晋级可能路径之一：第三名分配赛后才确定。"
  },
  {
    "id": "m81",
    "matchNumber": "M81",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "D组第一",
    "awayTeam": "B/E/F/I/J组第三晋级队",
    "kickoffUtc": "2026-07-02T00:00:00Z",
    "venue": "Levi's Stadium",
    "city": "Santa Clara",
    "importance": "high",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M81",
      "32强赛",
      "2026-07-02 周四 08:00",
      "柏林时间 07-02 周四 02:00",
      "德国队",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-02 周四 08:00",
    "sourceBerlinTime": "07-02 周四 02:00",
    "watchReason": "🔄 淘汰赛待更新 德国若 E 组第三晋级可能路径之一：第三名分配赛后才确定。"
  },
  {
    "id": "m84",
    "matchNumber": "M84",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "H组第一",
    "awayTeam": "J组第二",
    "kickoffUtc": "2026-07-02T19:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M84",
      "32强赛",
      "2026-07-03 周五 03:00",
      "柏林时间 07-02 周四 21:00"
    ],
    "sourceBeijingTime": "2026-07-03 周五 03:00",
    "sourceBerlinTime": "07-02 周四 21:00",
    "watchReason": ""
  },
  {
    "id": "m83",
    "matchNumber": "M83",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "K组第二",
    "awayTeam": "L组第二",
    "kickoffUtc": "2026-07-02T23:00:00Z",
    "venue": "BMO Field",
    "city": "Toronto",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M83",
      "32强赛",
      "2026-07-03 周五 07:00",
      "柏林时间 07-03 周五 01:00"
    ],
    "sourceBeijingTime": "2026-07-03 周五 07:00",
    "sourceBerlinTime": "07-03 周五 01:00",
    "watchReason": ""
  },
  {
    "id": "m85",
    "matchNumber": "M85",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "B组第一",
    "awayTeam": "E/F/G/I/J组第三晋级队",
    "kickoffUtc": "2026-07-03T03:00:00Z",
    "venue": "BC Place",
    "city": "Vancouver",
    "importance": "high",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M85",
      "32强赛",
      "2026-07-03 周五 11:00",
      "柏林时间 07-03 周五 05:00",
      "德国队",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-03 周五 11:00",
    "sourceBerlinTime": "07-03 周五 05:00",
    "watchReason": "🔄 淘汰赛待更新 德国若 E 组第三晋级可能路径之一：第三名分配赛后才确定。"
  },
  {
    "id": "m88",
    "matchNumber": "M88",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "D组第二",
    "awayTeam": "G组第二",
    "kickoffUtc": "2026-07-03T18:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M88",
      "32强赛",
      "2026-07-04 周六 02:00",
      "柏林时间 07-03 周五 20:00"
    ],
    "sourceBeijingTime": "2026-07-04 周六 02:00",
    "sourceBerlinTime": "07-03 周五 20:00",
    "watchReason": ""
  },
  {
    "id": "m86",
    "matchNumber": "M86",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "J组第一",
    "awayTeam": "H组第二",
    "kickoffUtc": "2026-07-03T22:00:00Z",
    "venue": "Hard Rock Stadium",
    "city": "Miami Gardens",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M86",
      "32强赛",
      "2026-07-04 周六 06:00",
      "柏林时间 07-04 周六 00:00"
    ],
    "sourceBeijingTime": "2026-07-04 周六 06:00",
    "sourceBerlinTime": "07-04 周六 00:00",
    "watchReason": ""
  },
  {
    "id": "m87",
    "matchNumber": "M87",
    "competition": "2026 FIFA World Cup",
    "stage": "32强赛",
    "homeTeam": "K组第一",
    "awayTeam": "D/E/I/J/L组第三晋级队",
    "kickoffUtc": "2026-07-04T01:30:00Z",
    "venue": "Arrowhead Stadium",
    "city": "Kansas City",
    "importance": "high",
    "relatedToGermany": true,
    "relatedBayernPlayers": [],
    "tags": [
      "M87",
      "32强赛",
      "2026-07-04 周六 09:30",
      "柏林时间 07-04 周六 03:30",
      "德国队",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-04 周六 09:30",
    "sourceBerlinTime": "07-04 周六 03:30",
    "watchReason": "🔄 淘汰赛待更新 德国若 E 组第三晋级可能路径之一：第三名分配赛后才确定。"
  },
  {
    "id": "m90",
    "matchNumber": "M90",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M73胜者",
    "awayTeam": "M75胜者",
    "kickoffUtc": "2026-07-04T17:00:00Z",
    "venue": "NRG Stadium",
    "city": "Houston",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M90",
      "16强赛",
      "2026-07-05 周日 01:00",
      "柏林时间 07-04 周六 19:00"
    ],
    "sourceBeijingTime": "2026-07-05 周日 01:00",
    "sourceBerlinTime": "07-04 周六 19:00",
    "watchReason": ""
  },
  {
    "id": "m89",
    "matchNumber": "M89",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M74胜者",
    "awayTeam": "M77胜者",
    "kickoffUtc": "2026-07-04T21:00:00Z",
    "venue": "Lincoln Financial Field",
    "city": "Philadelphia",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M89",
      "16强赛",
      "2026-07-05 周日 05:00",
      "柏林时间 07-04 周六 23:00"
    ],
    "sourceBeijingTime": "2026-07-05 周日 05:00",
    "sourceBerlinTime": "07-04 周六 23:00",
    "watchReason": ""
  },
  {
    "id": "m91",
    "matchNumber": "M91",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M76胜者",
    "awayTeam": "M78胜者",
    "kickoffUtc": "2026-07-05T20:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M91",
      "16强赛",
      "2026-07-06 周一 04:00",
      "柏林时间 07-05 周日 22:00"
    ],
    "sourceBeijingTime": "2026-07-06 周一 04:00",
    "sourceBerlinTime": "07-05 周日 22:00",
    "watchReason": ""
  },
  {
    "id": "m92",
    "matchNumber": "M92",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M79胜者",
    "awayTeam": "M80胜者",
    "kickoffUtc": "2026-07-06T00:00:00Z",
    "venue": "Estadio Azteca",
    "city": "Mexico City",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M92",
      "16强赛",
      "2026-07-06 周一 08:00",
      "柏林时间 07-06 周一 02:00"
    ],
    "sourceBeijingTime": "2026-07-06 周一 08:00",
    "sourceBerlinTime": "07-06 周一 02:00",
    "watchReason": ""
  },
  {
    "id": "m93",
    "matchNumber": "M93",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M83胜者",
    "awayTeam": "M84胜者",
    "kickoffUtc": "2026-07-06T19:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M93",
      "16强赛",
      "2026-07-07 周二 03:00",
      "柏林时间 07-06 周一 21:00"
    ],
    "sourceBeijingTime": "2026-07-07 周二 03:00",
    "sourceBerlinTime": "07-06 周一 21:00",
    "watchReason": ""
  },
  {
    "id": "m94",
    "matchNumber": "M94",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M81胜者",
    "awayTeam": "M82胜者",
    "kickoffUtc": "2026-07-07T00:00:00Z",
    "venue": "Lumen Field",
    "city": "Seattle",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M94",
      "16强赛",
      "2026-07-07 周二 08:00",
      "柏林时间 07-07 周二 02:00"
    ],
    "sourceBeijingTime": "2026-07-07 周二 08:00",
    "sourceBerlinTime": "07-07 周二 02:00",
    "watchReason": ""
  },
  {
    "id": "m95",
    "matchNumber": "M95",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M86胜者",
    "awayTeam": "M88胜者",
    "kickoffUtc": "2026-07-07T16:00:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M95",
      "16强赛",
      "2026-07-08 周三 00:00",
      "柏林时间 07-07 周二 18:00"
    ],
    "sourceBeijingTime": "2026-07-08 周三 00:00",
    "sourceBerlinTime": "07-07 周二 18:00",
    "watchReason": ""
  },
  {
    "id": "m96",
    "matchNumber": "M96",
    "competition": "2026 FIFA World Cup",
    "stage": "16强赛",
    "homeTeam": "M85胜者",
    "awayTeam": "M87胜者",
    "kickoffUtc": "2026-07-07T20:00:00Z",
    "venue": "BC Place",
    "city": "Vancouver",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M96",
      "16强赛",
      "2026-07-08 周三 04:00",
      "柏林时间 07-07 周二 22:00"
    ],
    "sourceBeijingTime": "2026-07-08 周三 04:00",
    "sourceBerlinTime": "07-07 周二 22:00",
    "watchReason": ""
  },
  {
    "id": "m97",
    "matchNumber": "M97",
    "competition": "2026 FIFA World Cup",
    "stage": "1/4决赛",
    "homeTeam": "M89胜者",
    "awayTeam": "M90胜者",
    "kickoffUtc": "2026-07-09T20:00:00Z",
    "venue": "Gillette Stadium",
    "city": "Foxborough",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M97",
      "1/4决赛",
      "2026-07-10 周五 04:00",
      "柏林时间 07-09 周四 22:00",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-10 周五 04:00",
    "sourceBerlinTime": "07-09 周四 22:00",
    "watchReason": "🌙 熬夜场 🔄 淘汰赛待更新 1/4 决赛：若德国或拜仁球员所在队晋级，再升级为必看。"
  },
  {
    "id": "m98",
    "matchNumber": "M98",
    "competition": "2026 FIFA World Cup",
    "stage": "1/4决赛",
    "homeTeam": "M93胜者",
    "awayTeam": "M94胜者",
    "kickoffUtc": "2026-07-10T19:00:00Z",
    "venue": "SoFi Stadium",
    "city": "Inglewood",
    "importance": "high",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M98",
      "1/4决赛",
      "2026-07-11 周六 03:00",
      "柏林时间 07-10 周五 21:00",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-11 周六 03:00",
    "sourceBerlinTime": "07-10 周五 21:00",
    "watchReason": "🌙 熬夜场 🔄 淘汰赛待更新 1/4 决赛：凌晨 03:00，赛前按真实对阵决定是否熬夜。"
  },
  {
    "id": "m99",
    "matchNumber": "M99",
    "competition": "2026 FIFA World Cup",
    "stage": "1/4决赛",
    "homeTeam": "M91胜者",
    "awayTeam": "M92胜者",
    "kickoffUtc": "2026-07-11T21:00:00Z",
    "venue": "Hard Rock Stadium",
    "city": "Miami Gardens",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M99",
      "1/4决赛",
      "2026-07-12 周日 05:00",
      "柏林时间 07-11 周六 23:00"
    ],
    "sourceBeijingTime": "2026-07-12 周日 05:00",
    "sourceBerlinTime": "07-11 周六 23:00",
    "watchReason": ""
  },
  {
    "id": "m100",
    "matchNumber": "M100",
    "competition": "2026 FIFA World Cup",
    "stage": "1/4决赛",
    "homeTeam": "M95胜者",
    "awayTeam": "M96胜者",
    "kickoffUtc": "2026-07-12T01:00:00Z",
    "venue": "Arrowhead Stadium",
    "city": "Kansas City",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M100",
      "1/4决赛",
      "2026-07-12 周日 09:00",
      "柏林时间 07-12 周日 03:00"
    ],
    "sourceBeijingTime": "2026-07-12 周日 09:00",
    "sourceBerlinTime": "07-12 周日 03:00",
    "watchReason": ""
  },
  {
    "id": "m101",
    "matchNumber": "M101",
    "competition": "2026 FIFA World Cup",
    "stage": "半决赛",
    "homeTeam": "M97胜者",
    "awayTeam": "M98胜者",
    "kickoffUtc": "2026-07-14T19:00:00Z",
    "venue": "AT&T Stadium",
    "city": "Arlington",
    "importance": "must-watch",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M101",
      "半决赛",
      "2026-07-15 周三 03:00",
      "柏林时间 07-14 周二 21:00",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-15 周三 03:00",
    "sourceBerlinTime": "07-14 周二 21:00",
    "watchReason": "⭐ 必看 🌙 熬夜场 🔄 淘汰赛待更新 半决赛：若德国或拜仁核心晋级，直接升为必看。"
  },
  {
    "id": "m102",
    "matchNumber": "M102",
    "competition": "2026 FIFA World Cup",
    "stage": "半决赛",
    "homeTeam": "M99胜者",
    "awayTeam": "M100胜者",
    "kickoffUtc": "2026-07-15T19:00:00Z",
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "importance": "must-watch",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M102",
      "半决赛",
      "2026-07-16 周四 03:00",
      "柏林时间 07-15 周三 21:00",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-16 周四 03:00",
    "sourceBerlinTime": "07-15 周三 21:00",
    "watchReason": "⭐ 必看 🌙 熬夜场 🔄 淘汰赛待更新 半决赛：若德国或拜仁核心晋级，直接升为必看。"
  },
  {
    "id": "m103",
    "matchNumber": "M103",
    "competition": "2026 FIFA World Cup",
    "stage": "三四名决赛",
    "homeTeam": "M101负者",
    "awayTeam": "M102负者",
    "kickoffUtc": "2026-07-18T21:00:00Z",
    "venue": "Hard Rock Stadium",
    "city": "Miami Gardens",
    "importance": "normal",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M103",
      "三四名决赛",
      "2026-07-19 周日 05:00",
      "柏林时间 07-18 周六 23:00"
    ],
    "sourceBeijingTime": "2026-07-19 周日 05:00",
    "sourceBerlinTime": "07-18 周六 23:00",
    "watchReason": ""
  },
  {
    "id": "m104",
    "matchNumber": "M104",
    "competition": "2026 FIFA World Cup",
    "stage": "决赛",
    "homeTeam": "M101胜者",
    "awayTeam": "M102胜者",
    "kickoffUtc": "2026-07-19T19:00:00Z",
    "venue": "MetLife Stadium",
    "city": "East Rutherford",
    "importance": "must-watch",
    "relatedToGermany": false,
    "relatedBayernPlayers": [],
    "tags": [
      "M104",
      "决赛",
      "2026-07-20 周一 03:00",
      "柏林时间 07-19 周日 21:00",
      "淘汰赛待更新"
    ],
    "sourceBeijingTime": "2026-07-20 周一 03:00",
    "sourceBerlinTime": "07-19 周日 21:00",
    "watchReason": "⭐ 必看 🌙 熬夜场 🔄 淘汰赛待更新 决赛：决赛本身必看，德国/拜仁元素赛后确认。"
  }
];

export const baseTimeZones = [
  "Asia/Hong_Kong",
  "Asia/Taipei",
  "Europe/Berlin",
  "Europe/London",
  "America/New_York",
  "Australia/Sydney",
  "UTC",
];
