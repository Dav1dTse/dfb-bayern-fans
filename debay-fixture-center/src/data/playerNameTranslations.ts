export type PlayerNameTranslation = {
  playerId?: string;
  originalName: string;
  normalizedName: string;
  zhCN: string;
  source: string;
  sourceType: "official" | "clubOfficial" | "associationOfficial" | "mediaCommon" | "manual";
  lastChecked: string;
  confidence: "high" | "medium" | "low";
  note?: string;
};

export const normalizePlayerName = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();

export const playerNameTranslations: PlayerNameTranslation[] = [
  {
    originalName: "Alphonso Davies",
    normalizedName: normalizePlayerName("Alphonso Davies"),
    zhCN: "阿方索·戴维斯",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Dayot Upamecano",
    normalizedName: normalizePlayerName("Dayot Upamecano"),
    zhCN: "达约·于帕梅卡诺",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Harry Kane",
    normalizedName: normalizePlayerName("Harry Kane"),
    zhCN: "哈里·凯恩",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Hiroki Ito",
    normalizedName: normalizePlayerName("Hiroki Ito"),
    zhCN: "伊藤洋辉",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Jamal Musiala",
    normalizedName: normalizePlayerName("Jamal Musiala"),
    zhCN: "贾马尔·穆西亚拉",
    source: "拜仁中文官网/DFB 与主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Jonathan Tah",
    normalizedName: normalizePlayerName("Jonathan Tah"),
    zhCN: "约纳坦·塔",
    source: "DFB/主流中文体育媒体通用译名",
    sourceType: "associationOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Joshua Kimmich",
    normalizedName: normalizePlayerName("Joshua Kimmich"),
    zhCN: "约书亚·基米希",
    source: "拜仁中文官网/DFB 与主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Josip Stanisic",
    normalizedName: normalizePlayerName("Josip Stanisic"),
    zhCN: "约瑟普·斯塔尼希奇",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
    note: "原名含变音符时也通过标准化名称匹配。",
  },
  {
    originalName: "Josip Stanišić",
    normalizedName: normalizePlayerName("Josip Stanišić"),
    zhCN: "约瑟普·斯塔尼希奇",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Kim Min-jae",
    normalizedName: normalizePlayerName("Kim Min-jae"),
    zhCN: "金玟哉",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Konrad Laimer",
    normalizedName: normalizePlayerName("Konrad Laimer"),
    zhCN: "康拉德·莱默",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Luis Diaz",
    normalizedName: normalizePlayerName("Luis Diaz"),
    zhCN: "路易斯·迪亚斯",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
    note: "原名含重音符时也通过标准化名称匹配。",
  },
  {
    originalName: "Luis Díaz",
    normalizedName: normalizePlayerName("Luis Díaz"),
    zhCN: "路易斯·迪亚斯",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Manuel Neuer",
    normalizedName: normalizePlayerName("Manuel Neuer"),
    zhCN: "曼努埃尔·诺伊尔",
    source: "拜仁中文官网/DFB 与主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Michael Olise",
    normalizedName: normalizePlayerName("Michael Olise"),
    zhCN: "迈克尔·奥利塞",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Nicolas Jackson",
    normalizedName: normalizePlayerName("Nicolas Jackson"),
    zhCN: "尼古拉斯·杰克逊",
    source: "拜仁中文官网/主流中文体育媒体通用译名",
    sourceType: "clubOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Cyle Larin",
    normalizedName: normalizePlayerName("Cyle Larin"),
    zhCN: "凯尔·拉林",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    originalName: "Promise David",
    normalizedName: normalizePlayerName("Promise David"),
    zhCN: "普罗米斯·戴维",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    originalName: "Lukic",
    normalizedName: normalizePlayerName("Lukic"),
    zhCN: "卢基奇",
    source: "本地 seed 事件仅给出姓氏，暂按中文媒体常见姓氏译法处理",
    sourceType: "manual",
    lastChecked: "2026-06-14",
    confidence: "low",
    note: "缺少 first name，后续拿到 API playerId 或全名后应替换为稳定映射。",
  },
  {
    originalName: "Julian Nagelsmann",
    normalizedName: normalizePlayerName("Julian Nagelsmann"),
    zhCN: "尤利安·纳格尔斯曼",
    source: "DFB/主流中文体育媒体通用译名",
    sourceType: "associationOfficial",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Oliver Baumann",
    normalizedName: normalizePlayerName("Oliver Baumann"),
    zhCN: "奥利弗·鲍曼",
    source: "https://zh.wikipedia.org/wiki/%E5%A5%A5%E5%88%A9%E5%BC%97%C2%B7%E9%B2%8D%E6%9B%BC",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Nico Schlotterbeck",
    normalizedName: normalizePlayerName("Nico Schlotterbeck"),
    zhCN: "尼科·施洛特贝克",
    source: "https://zh.wikipedia.org/wiki/%E5%B0%BC%E7%A7%91%C2%B7%E6%96%BD%E6%B4%9B%E7%89%B9%E8%B2%9D%E5%85%8B",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "David Raum",
    normalizedName: normalizePlayerName("David Raum"),
    zhCN: "达维德·劳姆",
    source: "https://zh.wikipedia.org/wiki/%E9%81%94%E7%B6%AD%E5%BE%B7%C2%B7%E5%8B%9E%E5%A7%86",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Leon Goretzka",
    normalizedName: normalizePlayerName("Leon Goretzka"),
    zhCN: "莱昂·戈雷茨卡",
    source: "https://zh.wikipedia.org/wiki/%E8%8E%B1%E6%98%82%C2%B7%E6%88%88%E9%9B%B7%E8%8C%A8%E5%8D%A1",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Aleksandar Pavlović",
    normalizedName: normalizePlayerName("Aleksandar Pavlović"),
    zhCN: "亚历山大·帕夫洛维奇",
    source: "https://zh.wikipedia.org/wiki/%E4%BA%9A%E5%8E%86%E5%B1%B1%E5%A4%A7%C2%B7%E5%B8%95%E5%A4%AB%E6%B4%9B%E7%BB%B4%E5%A5%87_%28%E8%B6%B3%E7%90%83%E5%91%98%29",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Leroy Sané",
    normalizedName: normalizePlayerName("Leroy Sané"),
    zhCN: "勒罗伊·萨内",
    source: "https://zh.wikipedia.org/wiki/%E5%8B%92%E9%AD%AF%E7%93%A6%C2%B7%E8%96%A9%E5%85%A7",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Serge Gnabry",
    normalizedName: normalizePlayerName("Serge Gnabry"),
    zhCN: "塞尔日·格纳布里",
    source: "https://zh.wikipedia.org/wiki/%E5%A1%9E%E5%B0%94%E6%97%A5%C2%B7%E6%A0%BC%E7%BA%B3%E5%B8%83%E9%87%8C",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Florian Wirtz",
    normalizedName: normalizePlayerName("Florian Wirtz"),
    zhCN: "弗洛里安·维尔茨",
    source: "https://zh.wikipedia.org/wiki/%E5%BC%97%E6%B4%9B%E9%87%8C%E5%AE%89%C2%B7%E7%BB%B4%E5%B0%94%E8%8C%A8",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Nick Woltemade",
    normalizedName: normalizePlayerName("Nick Woltemade"),
    zhCN: "尼克·沃尔特马德",
    source: "https://zh.wikipedia.org/wiki/%E5%B0%BC%E5%85%8B%C2%B7%E6%B2%83%E5%B0%94%E7%89%B9%E9%A9%AC%E5%BE%B7",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Jesse Marsch",
    normalizedName: normalizePlayerName("Jesse Marsch"),
    zhCN: "杰西·马什",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    originalName: "Sergej Barbarez",
    normalizedName: normalizePlayerName("Sergej Barbarez"),
    zhCN: "塞尔吉·巴尔巴雷兹",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    originalName: "Javier Aguirre",
    normalizedName: normalizePlayerName("Javier Aguirre"),
    zhCN: "哈维尔·阿吉雷",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Hugo Broos",
    normalizedName: normalizePlayerName("Hugo Broos"),
    zhCN: "雨果·布鲁斯",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    originalName: "Hong Myung-bo",
    normalizedName: normalizePlayerName("Hong Myung-bo"),
    zhCN: "洪明甫",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Ivan Hasek",
    normalizedName: normalizePlayerName("Ivan Hasek"),
    zhCN: "伊万·哈谢克",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
    note: "原名含变音符时也通过标准化名称匹配。",
  },
  {
    originalName: "Ivan Hašek",
    normalizedName: normalizePlayerName("Ivan Hašek"),
    zhCN: "伊万·哈谢克",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    originalName: "Mauricio Pochettino",
    normalizedName: normalizePlayerName("Mauricio Pochettino"),
    zhCN: "毛里西奥·波切蒂诺",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    originalName: "Gustavo Alfaro",
    normalizedName: normalizePlayerName("Gustavo Alfaro"),
    zhCN: "古斯塔沃·阿尔法罗",
    source: "主流中文体育媒体通用译名",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    playerId: "127227",
    originalName: "Israel Reyes",
    normalizedName: normalizePlayerName("Israel Reyes"),
    zhCN: "以瑟雷·雷耶斯",
    source: "https://www.wikidata.org/wiki/Q107739233",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "medium",
  },
  {
    playerId: "2873",
    originalName: "César Montes",
    normalizedName: normalizePlayerName("César Montes"),
    zhCN: "塞萨尔·蒙特斯",
    source: "https://zh.wikipedia.org/wiki/%E5%A1%9E%E8%90%A8%E5%B0%94%C2%B7%E8%92%99%E7%89%B9%E6%96%AF",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "126949",
    originalName: "Chris Richards",
    normalizedName: normalizePlayerName("Chris Richards"),
    zhCN: "克里斯·理查兹",
    source: "https://zh.wikipedia.org/wiki/%E5%85%8B%E9%87%8C%E6%96%AF%C2%B7%E7%90%86%E6%9F%A5%E5%85%B9_(%E8%B6%B3%E7%90%83%E8%BF%90%E5%8A%A8%E5%91%98)",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "19023",
    originalName: "Tim Ream",
    normalizedName: normalizePlayerName("Tim Ream"),
    zhCN: "蒂姆·里姆",
    source: "https://zh.wikipedia.org/wiki/%E8%92%82%E5%A7%86%C2%B7%E9%87%8C%E5%A7%86",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "19549",
    originalName: "Antonee Robinson",
    normalizedName: normalizePlayerName("Antonee Robinson"),
    zhCN: "安东尼·鲁宾逊",
    source: "https://zh.wikipedia.org/wiki/%E5%AE%89%E4%B8%9C%E5%B0%BC%C2%B7%E9%B2%81%E5%AE%BE%E9%80%8A_(%E8%B6%B3%E7%90%83%E8%BF%90%E5%8A%A8%E5%91%98)",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "19066",
    originalName: "Grant Hanley",
    normalizedName: normalizePlayerName("Grant Hanley"),
    zhCN: "格蘭特·漢利",
    source: "https://zh.wikipedia.org/wiki/%E6%A0%BC%E8%98%AD%E7%89%B9%C2%B7%E6%BC%A2%E5%88%A9",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "903",
    originalName: "Scott McTominay",
    normalizedName: normalizePlayerName("Scott McTominay"),
    zhCN: "史葛·麥湯明尼",
    source: "https://zh.wikipedia.org/wiki/%E5%8F%B2%E8%91%9B%C2%B7%E9%BA%A5%E6%B9%AF%E6%98%8E%E5%B0%BC",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "19191",
    originalName: "John McGinn",
    normalizedName: normalizePlayerName("John McGinn"),
    zhCN: "約翰·麥金",
    source: "https://zh.wikipedia.org/wiki/%E7%B4%84%E7%BF%B0%C2%B7%E9%BA%A5%E9%87%91",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "46930",
    originalName: "Ermedin Demirović",
    normalizedName: normalizePlayerName("Ermedin Demirović"),
    zhCN: "埃尔梅丁·德米罗维奇",
    source: "https://zh.wikipedia.org/wiki/%E5%9F%83%E5%B0%94%E6%A2%85%E4%B8%81%C2%B7%E5%BE%B7%E7%B1%B3%E7%BD%97%E7%BB%B4%E5%A5%87",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "77037",
    originalName: "Jovo Lukić",
    normalizedName: normalizePlayerName("Jovo Lukić"),
    zhCN: "喬沃·盧基奇",
    source: "https://zh.wikipedia.org/wiki/%E5%96%AC%E6%B2%83%C2%B7%E7%9B%A7%E5%9F%BA%E5%A5%87",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
  {
    playerId: "790",
    originalName: "Edin Džeko",
    normalizedName: normalizePlayerName("Edin Džeko"),
    zhCN: "埃丁·哲科",
    source: "https://zh.wikipedia.org/wiki/%E5%9F%83%E4%B8%81%C2%B7%E5%93%B2%E7%A7%91",
    sourceType: "mediaCommon",
    lastChecked: "2026-06-14",
    confidence: "high",
  },
];

const translationByPlayerId = new Map(
  playerNameTranslations
    .filter((item) => item.playerId)
    .map((item) => [item.playerId as string, item]),
);

const translationByNormalizedName = new Map(
  playerNameTranslations.map((item) => [item.normalizedName, item]),
);

const warnedMissingNames = new Set<string>();

export const getPlayerNameTranslation = (
  originalName: string,
  playerId?: string,
): PlayerNameTranslation | undefined => {
  if (playerId) {
    const byId = translationByPlayerId.get(playerId);
    if (byId) {
      return byId;
    }
  }

  return translationByNormalizedName.get(normalizePlayerName(originalName));
};

export const getPlayerDisplayName = (originalName: string, playerId?: string): string =>
  getPlayerNameTranslation(originalName, playerId)?.zhCN ?? originalName;

export const warnMissingPlayerTranslation = (originalName: string, playerId?: string) => {
  if (!originalName || import.meta.env.PROD) {
    return;
  }

  const key = `${playerId ?? "name"}:${normalizePlayerName(originalName)}`;
  if (warnedMissingNames.has(key) || getPlayerNameTranslation(originalName, playerId)) {
    return;
  }

  warnedMissingNames.add(key);
  console.warn(`[PlayerName] 缺少球员中文名映射：${originalName}`, { playerId });
};

export const getMissingPlayerTranslations = (
  names: Array<{ name: string; playerId?: string }>,
): string[] => {
  const missing = new Set<string>();

  names.forEach(({ name, playerId }) => {
    if (name && !getPlayerNameTranslation(name, playerId)) {
      missing.add(name);
    }
  });

  return Array.from(missing).sort((left, right) => left.localeCompare(right));
};
