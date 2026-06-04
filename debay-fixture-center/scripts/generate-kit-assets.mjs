import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(root, "public/kits");

const kits = [
  { team: "阿尔及利亚", slug: "algeria", base: "#f7f7f2", secondary: "#0b7a3b", accent: "#cf142b", pattern: "pinstripe" },
  { team: "阿根廷", slug: "argentina", base: "#ffffff", secondary: "#75aadb", accent: "#1f2d5c", pattern: "vertical" },
  { team: "澳大利亚", slug: "australia", base: "#f9d616", secondary: "#00543d", accent: "#ffffff", pattern: "waves" },
  { team: "奥地利", slug: "austria", base: "#d71920", secondary: "#101010", accent: "#ffffff", pattern: "mountain" },
  { team: "比利时", slug: "belgium", base: "#7b1015", secondary: "#f7c600", accent: "#111111", pattern: "flame" },
  { team: "波黑", slug: "bosnia-herzegovina", base: "#102a5c", secondary: "#f7c600", accent: "#ffffff", pattern: "diagonal" },
  { team: "巴西", slug: "brazil", base: "#ffdf00", secondary: "#009b3a", accent: "#002776", pattern: "collarBand" },
  { team: "加拿大", slug: "canada", base: "#d80621", secondary: "#ffffff", accent: "#111111", pattern: "leaf" },
  { team: "佛得角", slug: "cape-verde", base: "#0d3b91", secondary: "#ffffff", accent: "#cf2027", pattern: "horizontal" },
  { team: "哥伦比亚", slug: "colombia", base: "#fcd116", secondary: "#003893", accent: "#ce1126", pattern: "sash" },
  { team: "克罗地亚", slug: "croatia", base: "#ffffff", secondary: "#d00027", accent: "#0b4ea2", pattern: "checks" },
  { team: "库拉索", slug: "curacao", base: "#003da5", secondary: "#f9e814", accent: "#ffffff", pattern: "waves" },
  { team: "捷克", slug: "czechia", base: "#b0162d", secondary: "#11457e", accent: "#ffffff", pattern: "sideTriangle" },
  { team: "刚果民主共和国", slug: "dr-congo", base: "#0095d9", secondary: "#f7d618", accent: "#ce1021", pattern: "sashDouble" },
  { team: "厄瓜多尔", slug: "ecuador", base: "#ffdd00", secondary: "#034ea2", accent: "#ed1c24", pattern: "bottomBands" },
  { team: "埃及", slug: "egypt", base: "#ce1126", secondary: "#ffffff", accent: "#111111", pattern: "collarBand" },
  { team: "英格兰", slug: "england", base: "#f7f7f7", secondary: "#c8102e", accent: "#14213d", pattern: "cross" },
  { team: "法国", slug: "france", base: "#1d2f6f", secondary: "#ffffff", accent: "#ed2939", pattern: "pinstripe" },
  { team: "德国", slug: "germany", base: "#ffffff", secondary: "#111111", accent: "#d71920", extra: "#f4c430", pattern: "germany" },
  { team: "加纳", slug: "ghana", base: "#ffffff", secondary: "#fcd116", accent: "#ce1126", extra: "#006b3f", pattern: "geoStar" },
  { team: "海地", slug: "haiti", base: "#00209f", secondary: "#d21034", accent: "#ffffff", pattern: "halves" },
  { team: "伊朗", slug: "iran", base: "#ffffff", secondary: "#239f40", accent: "#da0000", pattern: "trimBands" },
  { team: "伊拉克", slug: "iraq", base: "#0b8f43", secondary: "#ffffff", accent: "#ce1126", pattern: "horizontal" },
  { team: "科特迪瓦", slug: "ivory-coast", base: "#f77f00", secondary: "#ffffff", accent: "#009e60", pattern: "textile" },
  { team: "日本", slug: "japan", base: "#143a8f", secondary: "#6fa3dc", accent: "#ffffff", pattern: "japanLines" },
  { team: "约旦", slug: "jordan", base: "#ffffff", secondary: "#007a3d", accent: "#ce1126", extra: "#111111", pattern: "sideTriangle" },
  { team: "韩国", slug: "korea-republic", base: "#f04c6a", secondary: "#2a2e8f", accent: "#ffffff", pattern: "tiger" },
  { team: "墨西哥", slug: "mexico", base: "#006847", secondary: "#ce1126", accent: "#ffffff", pattern: "aztec" },
  { team: "摩洛哥", slug: "morocco", base: "#c1272d", secondary: "#006233", accent: "#ffffff", pattern: "collarBand" },
  { team: "荷兰", slug: "netherlands", base: "#f36c21", secondary: "#1b2a67", accent: "#ffffff", pattern: "pinstripe" },
  { team: "新西兰", slug: "new-zealand", base: "#111111", secondary: "#bfe3f2", accent: "#ffffff", pattern: "landscape" },
  { team: "挪威", slug: "norway", base: "#ba0c2f", secondary: "#00205b", accent: "#ffffff", pattern: "nordic" },
  { team: "巴拿马", slug: "panama", base: "#ffffff", secondary: "#d21034", accent: "#005293", pattern: "quarters" },
  { team: "巴拉圭", slug: "paraguay", base: "#ffffff", secondary: "#d52b1e", accent: "#0038a8", pattern: "vertical" },
  { team: "葡萄牙", slug: "portugal", base: "#7f1020", secondary: "#006600", accent: "#f2c94c", pattern: "waves" },
  { team: "卡塔尔", slug: "qatar", base: "#8a1538", secondary: "#ffffff", accent: "#d9c7cf", pattern: "serrated" },
  { team: "沙特阿拉伯", slug: "saudi-arabia", base: "#ffffff", secondary: "#006c35", accent: "#d8efe2", pattern: "palm" },
  { team: "苏格兰", slug: "scotland", base: "#003876", secondary: "#ffffff", accent: "#005eb8", pattern: "saltire" },
  { team: "塞内加尔", slug: "senegal", base: "#ffffff", secondary: "#00853f", accent: "#e31b23", extra: "#fdef42", pattern: "geoStar" },
  { team: "南非", slug: "south-africa", base: "#007a4d", secondary: "#ffb612", accent: "#ffffff", pattern: "sashDouble" },
  { team: "西班牙", slug: "spain", base: "#aa151b", secondary: "#f1bf00", accent: "#0b1f4d", pattern: "pinstripe" },
  { team: "瑞典", slug: "sweden", base: "#fecc00", secondary: "#006aa7", accent: "#ffffff", pattern: "nordic" },
  { team: "瑞士", slug: "switzerland", base: "#d52b1e", secondary: "#ffffff", accent: "#9b0d1d", pattern: "swissCross" },
  { team: "突尼斯", slug: "tunisia", base: "#ffffff", secondary: "#e70013", accent: "#f5d7dc", pattern: "crescent" },
  { team: "土耳其", slug: "turkiye", base: "#e30a17", secondary: "#ffffff", accent: "#b40012", pattern: "crescent" },
  { team: "美国", slug: "usa", base: "#ffffff", secondary: "#b22234", accent: "#3c3b6e", pattern: "diagonal" },
  { team: "乌拉圭", slug: "uruguay", base: "#7fc8f8", secondary: "#111111", accent: "#ffffff", pattern: "collarBand" },
  { team: "乌兹别克斯坦", slug: "uzbekistan", base: "#ffffff", secondary: "#1eb5e5", accent: "#1eb53a", extra: "#ce1126", pattern: "trimBands" },
];

const escape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;");

const shirtPath =
  "M72 42 L96 22 H144 L168 42 L210 79 L176 119 L160 94 V226 H80 V94 L64 119 L30 79 Z";

const patternSvg = (kit, clipId) => {
  const s = kit.secondary;
  const a = kit.accent;
  const e = kit.extra ?? a;

  switch (kit.pattern) {
    case "vertical":
      return `<g clip-path="url(#${clipId})"><rect x="80" y="20" width="18" height="220" fill="${s}" opacity=".9"/><rect x="122" y="20" width="18" height="220" fill="${s}" opacity=".9"/><rect x="164" y="20" width="18" height="220" fill="${s}" opacity=".9"/><path d="M80 226h80" stroke="${a}" stroke-width="8" opacity=".45"/></g>`;
    case "horizontal":
      return `<g clip-path="url(#${clipId})"><rect x="70" y="78" width="100" height="16" fill="${s}" opacity=".86"/><rect x="72" y="128" width="96" height="12" fill="${a}" opacity=".78"/><rect x="80" y="190" width="80" height="10" fill="${s}" opacity=".55"/></g>`;
    case "pinstripe":
      return `<g clip-path="url(#${clipId})">${Array.from({ length: 7 }, (_, i) => `<path d="M${78 + i * 14} 34 V226" stroke="${s}" stroke-width="2.4" opacity=".55"/>`).join("")}<path d="M72 58 H168" stroke="${a}" stroke-width="5" opacity=".35"/></g>`;
    case "diagonal":
      return `<g clip-path="url(#${clipId})"><path d="M38 205 L184 50" stroke="${s}" stroke-width="24" opacity=".9"/><path d="M55 214 L202 58" stroke="${a}" stroke-width="8" opacity=".75"/></g>`;
    case "sash":
      return `<g clip-path="url(#${clipId})"><path d="M52 210 L176 42" stroke="${s}" stroke-width="28" opacity=".9"/><path d="M68 220 L194 50" stroke="${a}" stroke-width="10" opacity=".85"/></g>`;
    case "sashDouble":
      return `<g clip-path="url(#${clipId})"><path d="M45 205 L176 44" stroke="${s}" stroke-width="30"/><path d="M62 216 L194 52" stroke="${a}" stroke-width="10"/></g>`;
    case "checks":
      return `<g clip-path="url(#${clipId})">${Array.from({ length: 5 }, (_, y) => Array.from({ length: 4 }, (_, x) => ((x + y) % 2 === 0 ? `<rect x="${74 + x * 24}" y="${54 + y * 24}" width="24" height="24" fill="${s}" opacity=".92"/>` : "")).join("")).join("")}<path d="M80 190 H160" stroke="${a}" stroke-width="7" opacity=".7"/></g>`;
    case "germany":
      return `<g clip-path="url(#${clipId})"><path d="M68 78 L116 116 L172 64" fill="none" stroke="${s}" stroke-width="15" stroke-linejoin="round"/><path d="M68 102 L116 140 L172 88" fill="none" stroke="${a}" stroke-width="15" stroke-linejoin="round"/><path d="M68 126 L116 164 L172 112" fill="none" stroke="${e}" stroke-width="15" stroke-linejoin="round"/></g>`;
    case "geoStar":
      return `<g clip-path="url(#${clipId})"><path d="M72 86 L112 60 L160 92 L122 116 Z" fill="${s}" opacity=".85"/><path d="M80 146 L122 124 L170 156 L126 180 Z" fill="${a}" opacity=".72"/><path d="M120 77 L127 96 L147 96 L131 108 L137 128 L120 116 L103 128 L109 108 L93 96 L113 96 Z" fill="${e}" opacity=".95"/></g>`;
    case "leaf":
      return `<g clip-path="url(#${clipId})"><path d="M120 70 L132 103 L158 94 L144 121 L166 132 L136 139 L143 172 L120 152 L97 172 L104 139 L74 132 L96 121 L82 94 L108 103 Z" fill="${s}" opacity=".28"/><path d="M120 54 V224" stroke="${s}" stroke-width="8" opacity=".24"/></g>`;
    case "flame":
      return `<g clip-path="url(#${clipId})"><path d="M80 226 C74 180 118 162 104 112 C137 136 130 166 160 190 C152 205 138 218 120 226 Z" fill="${s}" opacity=".75"/><path d="M72 62 H168" stroke="${a}" stroke-width="7" opacity=".8"/></g>`;
    case "waves":
      return `<g clip-path="url(#${clipId})">${Array.from({ length: 5 }, (_, i) => `<path d="M55 ${84 + i * 26} C86 ${62 + i * 26} 116 ${106 + i * 26} 166 ${80 + i * 26}" fill="none" stroke="${s}" stroke-width="8" opacity="${0.28 + i * 0.08}"/>`).join("")}<path d="M82 226 H158" stroke="${a}" stroke-width="8" opacity=".68"/></g>`;
    case "mountain":
      return `<g clip-path="url(#${clipId})"><path d="M62 160 L96 103 L120 137 L143 92 L178 160 Z" fill="${s}" opacity=".34"/><path d="M80 226 H160" stroke="${a}" stroke-width="8" opacity=".9"/></g>`;
    case "sideTriangle":
      return `<g clip-path="url(#${clipId})"><path d="M70 42 L132 126 L70 210 Z" fill="${s}" opacity=".86"/><path d="M78 62 L118 126 L78 190 Z" fill="${a}" opacity=".5"/></g>`;
    case "bottomBands":
      return `<g clip-path="url(#${clipId})"><rect x="72" y="166" width="96" height="22" fill="${s}"/><rect x="72" y="188" width="96" height="24" fill="${a}"/></g>`;
    case "halves":
      return `<g clip-path="url(#${clipId})"><rect x="120" y="28" width="60" height="210" fill="${s}" opacity=".92"/><path d="M120 28 V226" stroke="${a}" stroke-width="5" opacity=".78"/></g>`;
    case "trimBands":
      return `<g clip-path="url(#${clipId})"><path d="M72 68 H168" stroke="${s}" stroke-width="9"/><path d="M72 86 H168" stroke="${a}" stroke-width="6"/><path d="M72 210 H168" stroke="${s}" stroke-width="8"/></g>`;
    case "textile":
      return `<g clip-path="url(#${clipId})">${Array.from({ length: 6 }, (_, i) => `<path d="M${62 + i * 20} 54 L${108 + i * 14} 226" stroke="${i % 2 ? s : a}" stroke-width="8" opacity=".28"/>`).join("")}<circle cx="120" cy="112" r="32" fill="${s}" opacity=".22"/></g>`;
    case "japanLines":
      return `<g clip-path="url(#${clipId})">${Array.from({ length: 9 }, (_, i) => `<path d="M${54 + i * 18} 42 L${102 + i * 6} 226" stroke="${s}" stroke-width="4" opacity=".42"/>`).join("")}<circle cx="120" cy="116" r="42" fill="none" stroke="${a}" stroke-width="5" opacity=".28"/></g>`;
    case "tiger":
      return `<g clip-path="url(#${clipId})">${Array.from({ length: 8 }, (_, i) => `<path d="M${68 + i * 15} 62 C${100 + i * 5} ${82 + i * 12} ${76 + i * 14} ${128 + i * 10} ${160 - i * 4} ${151 + i * 7}" fill="none" stroke="${i % 2 ? s : a}" stroke-width="7" opacity=".26"/>`).join("")}</g>`;
    case "aztec":
      return `<g clip-path="url(#${clipId})"><path d="M82 74 H158 V98 H136 V122 H160 V146 H82 V122 H104 V98 H82 Z" fill="${s}" opacity=".55"/><path d="M80 190 H160" stroke="${a}" stroke-width="8" opacity=".72"/></g>`;
    case "landscape":
      return `<g clip-path="url(#${clipId})"><path d="M58 172 C88 132 118 168 140 122 C152 145 170 152 186 134 V226 H58 Z" fill="${s}" opacity=".24"/><path d="M70 92 H170" stroke="${a}" stroke-width="5" opacity=".5"/></g>`;
    case "nordic":
      return `<g clip-path="url(#${clipId})"><path d="M96 42 V226" stroke="${s}" stroke-width="12" opacity=".92"/><path d="M72 104 H168" stroke="${s}" stroke-width="12" opacity=".92"/><path d="M104 42 V226" stroke="${a}" stroke-width="4" opacity=".8"/><path d="M72 112 H168" stroke="${a}" stroke-width="4" opacity=".8"/></g>`;
    case "quarters":
      return `<g clip-path="url(#${clipId})"><rect x="72" y="42" width="48" height="92" fill="${s}" opacity=".9"/><rect x="120" y="134" width="48" height="92" fill="${a}" opacity=".9"/></g>`;
    case "serrated":
      return `<g clip-path="url(#${clipId})"><path d="M70 48 L98 62 L70 76 L98 90 L70 104 L98 118 L70 132 L98 146 L70 160 L98 174 L70 188 L98 202 L70 216" fill="none" stroke="${s}" stroke-width="18" stroke-linejoin="miter" opacity=".94"/></g>`;
    case "palm":
      return `<g clip-path="url(#${clipId})"><path d="M120 78 C100 88 92 104 88 130 C103 118 112 104 120 78 C128 104 137 118 152 130 C148 104 140 88 120 78 Z" fill="${s}" opacity=".42"/><path d="M120 96 V196" stroke="${s}" stroke-width="7" opacity=".38"/></g>`;
    case "saltire":
      return `<g clip-path="url(#${clipId})"><path d="M64 54 L176 212 M176 54 L64 212" stroke="${s}" stroke-width="12" opacity=".85"/><path d="M72 226 H168" stroke="${a}" stroke-width="8" opacity=".6"/></g>`;
    case "swissCross":
      return `<g clip-path="url(#${clipId})"><path d="M108 86 H132 V110 H156 V134 H132 V158 H108 V134 H84 V110 H108 Z" fill="${s}"/><path d="M76 204 H164" stroke="${a}" stroke-width="8" opacity=".45"/></g>`;
    case "crescent":
      return `<g clip-path="url(#${clipId})"><circle cx="112" cy="105" r="34" fill="${s}" opacity=".92"/><circle cx="123" cy="101" r="29" fill="${kit.base}" opacity="1"/><path d="M148 83 L154 99 L171 99 L157 109 L163 126 L148 116 L134 126 L140 109 L126 99 L143 99 Z" fill="${s}" opacity=".92"/></g>`;
    case "cross":
      return `<g clip-path="url(#${clipId})"><path d="M116 42 V226" stroke="${s}" stroke-width="8" opacity=".5"/><path d="M72 104 H168" stroke="${s}" stroke-width="8" opacity=".5"/><path d="M72 226 H168" stroke="${a}" stroke-width="7" opacity=".7"/></g>`;
    case "collarBand":
    default:
      return `<g clip-path="url(#${clipId})"><path d="M72 68 H168" stroke="${s}" stroke-width="10" opacity=".82"/><path d="M80 226 H160" stroke="${a}" stroke-width="8" opacity=".68"/></g>`;
  }
};

const svgForKit = (kit) => {
  const clipId = `shirt-${kit.slug}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 260" role="img" aria-label="${escape(kit.team)} 2026 home kit">
  <defs>
    <clipPath id="${clipId}">
      <path d="${shirtPath}"/>
    </clipPath>
    <filter id="shadow-${kit.slug}" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#111111" flood-opacity=".22"/>
    </filter>
  </defs>
  <g filter="url(#shadow-${kit.slug})">
    <path d="${shirtPath}" fill="${kit.base}"/>
    ${patternSvg(kit, clipId)}
    <path d="M96 22 H144 L132 47 H108 Z" fill="#ffffff" opacity=".9"/>
    <path d="M96 22 H144 L132 47 H108 Z" fill="${kit.secondary}" opacity=".32"/>
    <path d="M80 94 V226 H160 V94" fill="none" stroke="#000000" stroke-opacity=".13" stroke-width="2"/>
    <path d="${shirtPath}" fill="none" stroke="#ffffff" stroke-opacity=".72" stroke-width="3"/>
    <path d="${shirtPath}" fill="none" stroke="#111111" stroke-opacity=".18" stroke-width="1.5"/>
  </g>
</svg>
`;
};

await mkdir(outputDir, { recursive: true });

for (const kit of kits) {
  await writeFile(resolve(outputDir, `${kit.slug}-2026-home.svg`), svgForKit(kit), "utf8");
}

console.log(`Generated ${kits.length} transparent kit SVGs in ${outputDir}`);
