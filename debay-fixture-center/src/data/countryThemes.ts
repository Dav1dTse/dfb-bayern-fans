export type CountryTheme = {
  background: string;
  borderColor: string;
  labelBackground: string;
  labelColor: string;
};

const fallbackTheme: CountryTheme = {
  background: "linear-gradient(135deg, #f3efe6, #ffffff)",
  borderColor: "#d8d0c1",
  labelBackground: "rgba(21, 21, 21, 0.86)",
  labelColor: "#ffffff",
};

export const countryThemes: Record<string, CountryTheme> = {
  Germany: {
    background: "linear-gradient(180deg, #050505 0 33.33%, #d71920 33.33% 66.66%, #f4c430 66.66% 100%)",
    borderColor: "#221c07",
    labelBackground: "rgba(255, 255, 255, 0.9)",
    labelColor: "#111111",
  },
  France: {
    background: "linear-gradient(90deg, #002395 0 33.33%, #ffffff 33.33% 66.66%, #ed2939 66.66% 100%)",
    borderColor: "#002395",
    labelBackground: "rgba(17, 32, 86, 0.88)",
    labelColor: "#ffffff",
  },
  England: {
    background:
      "linear-gradient(90deg, transparent 0 42%, #c8102e 42% 58%, transparent 58%), linear-gradient(180deg, transparent 0 38%, #c8102e 38% 62%, transparent 62%), #ffffff",
    borderColor: "#c8102e",
    labelBackground: "rgba(200, 16, 46, 0.9)",
    labelColor: "#ffffff",
  },
  Canada: {
    background: "linear-gradient(90deg, #d80621 0 28%, #ffffff 28% 72%, #d80621 72% 100%)",
    borderColor: "#d80621",
    labelBackground: "rgba(216, 6, 33, 0.9)",
    labelColor: "#ffffff",
  },
  Portugal: {
    background: "linear-gradient(90deg, #006600 0 42%, #ff0000 42% 100%)",
    borderColor: "#006600",
    labelBackground: "rgba(18, 65, 31, 0.88)",
    labelColor: "#ffffff",
  },
  Belgium: {
    background: "linear-gradient(90deg, #000000 0 33.33%, #ffd90c 33.33% 66.66%, #ef3340 66.66% 100%)",
    borderColor: "#1f1f1f",
    labelBackground: "rgba(0, 0, 0, 0.84)",
    labelColor: "#ffffff",
  },
  Brazil: {
    background:
      "radial-gradient(circle at 50% 50%, #233a8b 0 17%, #ffdf00 18% 36%, transparent 37%), #009b3a",
    borderColor: "#009b3a",
    labelBackground: "rgba(0, 79, 42, 0.88)",
    labelColor: "#ffffff",
  },
  Netherlands: {
    background: "linear-gradient(180deg, #ae1c28 0 33.33%, #ffffff 33.33% 66.66%, #21468b 66.66% 100%)",
    borderColor: "#21468b",
    labelBackground: "rgba(33, 70, 139, 0.9)",
    labelColor: "#ffffff",
  },
  USA: {
    background:
      "linear-gradient(90deg, #3b3f87 0 38%, transparent 38%), repeating-linear-gradient(180deg, #b22234 0 7px, #ffffff 7px 14px)",
    borderColor: "#3b3f87",
    labelBackground: "rgba(38, 43, 99, 0.9)",
    labelColor: "#ffffff",
  },
  德国: {
    background: "linear-gradient(180deg, #050505 0 33.33%, #d71920 33.33% 66.66%, #f4c430 66.66% 100%)",
    borderColor: "#221c07",
    labelBackground: "rgba(255, 255, 255, 0.9)",
    labelColor: "#111111",
  },
  法国: {
    background: "linear-gradient(90deg, #002395 0 33.33%, #ffffff 33.33% 66.66%, #ed2939 66.66% 100%)",
    borderColor: "#002395",
    labelBackground: "rgba(17, 32, 86, 0.88)",
    labelColor: "#ffffff",
  },
  英格兰: {
    background:
      "linear-gradient(90deg, transparent 0 42%, #c8102e 42% 58%, transparent 58%), linear-gradient(180deg, transparent 0 38%, #c8102e 38% 62%, transparent 62%), #ffffff",
    borderColor: "#c8102e",
    labelBackground: "rgba(200, 16, 46, 0.9)",
    labelColor: "#ffffff",
  },
  加拿大: {
    background: "linear-gradient(90deg, #d80621 0 28%, #ffffff 28% 72%, #d80621 72% 100%)",
    borderColor: "#d80621",
    labelBackground: "rgba(216, 6, 33, 0.9)",
    labelColor: "#ffffff",
  },
  葡萄牙: {
    background: "linear-gradient(90deg, #006600 0 42%, #ff0000 42% 100%)",
    borderColor: "#006600",
    labelBackground: "rgba(18, 65, 31, 0.88)",
    labelColor: "#ffffff",
  },
  比利时: {
    background: "linear-gradient(90deg, #000000 0 33.33%, #ffd90c 33.33% 66.66%, #ef3340 66.66% 100%)",
    borderColor: "#1f1f1f",
    labelBackground: "rgba(0, 0, 0, 0.84)",
    labelColor: "#ffffff",
  },
  巴西: {
    background:
      "radial-gradient(circle at 50% 50%, #233a8b 0 17%, #ffdf00 18% 36%, transparent 37%), #009b3a",
    borderColor: "#009b3a",
    labelBackground: "rgba(0, 79, 42, 0.88)",
    labelColor: "#ffffff",
  },
  荷兰: {
    background: "linear-gradient(180deg, #ae1c28 0 33.33%, #ffffff 33.33% 66.66%, #21468b 66.66% 100%)",
    borderColor: "#21468b",
    labelBackground: "rgba(33, 70, 139, 0.9)",
    labelColor: "#ffffff",
  },
  美国: {
    background:
      "linear-gradient(90deg, #3b3f87 0 38%, transparent 38%), repeating-linear-gradient(180deg, #b22234 0 7px, #ffffff 7px 14px)",
    borderColor: "#3b3f87",
    labelBackground: "rgba(38, 43, 99, 0.9)",
    labelColor: "#ffffff",
  },
  墨西哥: {
    background: "linear-gradient(90deg, #006847 0 33.33%, #ffffff 33.33% 66.66%, #ce1126 66.66% 100%)",
    borderColor: "#006847",
    labelBackground: "rgba(0, 104, 71, 0.9)",
    labelColor: "#ffffff",
  },
  南非: {
    background:
      "linear-gradient(90deg, #007a4d 0 34%, transparent 34%), linear-gradient(150deg, #ffb612 0 22%, #000000 22% 35%, transparent 35%), linear-gradient(180deg, #de3831 0 50%, #002395 50% 100%)",
    borderColor: "#007a4d",
    labelBackground: "rgba(0, 63, 45, 0.9)",
    labelColor: "#ffffff",
  },
  韩国: {
    background: "radial-gradient(circle at 50% 50%, #c60c30 0 18%, #003478 19% 34%, transparent 35%), #ffffff",
    borderColor: "#003478",
    labelBackground: "rgba(0, 52, 120, 0.9)",
    labelColor: "#ffffff",
  },
  捷克: {
    background: "linear-gradient(150deg, #11457e 0 36%, transparent 36%), linear-gradient(180deg, #ffffff 0 50%, #d7141a 50% 100%)",
    borderColor: "#11457e",
    labelBackground: "rgba(17, 69, 126, 0.9)",
    labelColor: "#ffffff",
  },
  波黑: {
    background: "linear-gradient(135deg, #002f6c 0 58%, #f7d117 58% 78%, #002f6c 78% 100%)",
    borderColor: "#002f6c",
    labelBackground: "rgba(0, 47, 108, 0.9)",
    labelColor: "#ffffff",
  },
  巴拉圭: {
    background: "linear-gradient(180deg, #d52b1e 0 33.33%, #ffffff 33.33% 66.66%, #0038a8 66.66% 100%)",
    borderColor: "#0038a8",
    labelBackground: "rgba(0, 56, 168, 0.9)",
    labelColor: "#ffffff",
  },
  卡塔尔: {
    background: "linear-gradient(90deg, #ffffff 0 28%, #8a1538 28% 100%)",
    borderColor: "#8a1538",
    labelBackground: "rgba(138, 21, 56, 0.9)",
    labelColor: "#ffffff",
  },
  瑞士: {
    background:
      "linear-gradient(90deg, transparent 0 42%, #ffffff 42% 58%, transparent 58%), linear-gradient(180deg, transparent 0 38%, #ffffff 38% 62%, transparent 62%), #d52b1e",
    borderColor: "#d52b1e",
    labelBackground: "rgba(127, 12, 24, 0.9)",
    labelColor: "#ffffff",
  },
  摩洛哥: {
    background: "radial-gradient(circle at 50% 50%, #006233 0 15%, transparent 16%), #c1272d",
    borderColor: "#c1272d",
    labelBackground: "rgba(117, 19, 27, 0.9)",
    labelColor: "#ffffff",
  },
  海地: {
    background: "linear-gradient(180deg, #00209f 0 50%, #d21034 50% 100%)",
    borderColor: "#00209f",
    labelBackground: "rgba(0, 32, 159, 0.9)",
    labelColor: "#ffffff",
  },
  苏格兰: {
    background:
      "linear-gradient(35deg, transparent 0 44%, #ffffff 44% 56%, transparent 56%), linear-gradient(145deg, transparent 0 44%, #ffffff 44% 56%, transparent 56%), #005eb8",
    borderColor: "#005eb8",
    labelBackground: "rgba(0, 94, 184, 0.9)",
    labelColor: "#ffffff",
  },
  澳大利亚: {
    background: "linear-gradient(135deg, #012169 0 55%, #ffffff 55% 62%, #e4002b 62% 100%)",
    borderColor: "#012169",
    labelBackground: "rgba(1, 33, 105, 0.9)",
    labelColor: "#ffffff",
  },
  土耳其: {
    background: "radial-gradient(circle at 43% 50%, #ffffff 0 16%, transparent 17%), #e30a17",
    borderColor: "#e30a17",
    labelBackground: "rgba(139, 0, 0, 0.9)",
    labelColor: "#ffffff",
  },
  库拉索: {
    background: "linear-gradient(180deg, #002b7f 0 62%, #f9e814 62% 74%, #002b7f 74% 100%)",
    borderColor: "#002b7f",
    labelBackground: "rgba(0, 43, 127, 0.9)",
    labelColor: "#ffffff",
  },
  日本: {
    background: "radial-gradient(circle at 50% 50%, #bc002d 0 24%, transparent 25%), #ffffff",
    borderColor: "#bc002d",
    labelBackground: "rgba(188, 0, 45, 0.9)",
    labelColor: "#ffffff",
  },
  科特迪瓦: {
    background: "linear-gradient(90deg, #f77f00 0 33.33%, #ffffff 33.33% 66.66%, #009e60 66.66% 100%)",
    borderColor: "#009e60",
    labelBackground: "rgba(0, 100, 54, 0.9)",
    labelColor: "#ffffff",
  },
  厄瓜多尔: {
    background: "linear-gradient(180deg, #ffdd00 0 50%, #034ea2 50% 75%, #ed1c24 75% 100%)",
    borderColor: "#034ea2",
    labelBackground: "rgba(3, 78, 162, 0.9)",
    labelColor: "#ffffff",
  },
  瑞典: {
    background:
      "linear-gradient(90deg, transparent 0 36%, #fecc00 36% 48%, transparent 48%), linear-gradient(180deg, transparent 0 42%, #fecc00 42% 58%, transparent 58%), #006aa7",
    borderColor: "#006aa7",
    labelBackground: "rgba(0, 106, 167, 0.9)",
    labelColor: "#ffffff",
  },
  突尼斯: {
    background: "radial-gradient(circle at 50% 50%, #ffffff 0 27%, transparent 28%), #e70013",
    borderColor: "#e70013",
    labelBackground: "rgba(151, 0, 19, 0.9)",
    labelColor: "#ffffff",
  },
  西班牙: {
    background: "linear-gradient(180deg, #aa151b 0 25%, #f1bf00 25% 75%, #aa151b 75% 100%)",
    borderColor: "#aa151b",
    labelBackground: "rgba(122, 16, 21, 0.9)",
    labelColor: "#ffffff",
  },
  佛得角: {
    background: "linear-gradient(180deg, #003893 0 44%, #ffffff 44% 50%, #cf2027 50% 58%, #ffffff 58% 64%, #003893 64% 100%)",
    borderColor: "#003893",
    labelBackground: "rgba(0, 56, 147, 0.9)",
    labelColor: "#ffffff",
  },
  埃及: {
    background: "linear-gradient(180deg, #ce1126 0 33.33%, #ffffff 33.33% 66.66%, #000000 66.66% 100%)",
    borderColor: "#111111",
    labelBackground: "rgba(0, 0, 0, 0.84)",
    labelColor: "#ffffff",
  },
  沙特阿拉伯: {
    background: "#006c35",
    borderColor: "#006c35",
    labelBackground: "rgba(0, 78, 42, 0.9)",
    labelColor: "#ffffff",
  },
  乌拉圭: {
    background: "repeating-linear-gradient(180deg, #ffffff 0 7px, #0038a8 7px 14px)",
    borderColor: "#0038a8",
    labelBackground: "rgba(0, 56, 168, 0.9)",
    labelColor: "#ffffff",
  },
  伊朗: {
    background: "linear-gradient(180deg, #239f40 0 33.33%, #ffffff 33.33% 66.66%, #da0000 66.66% 100%)",
    borderColor: "#239f40",
    labelBackground: "rgba(35, 95, 64, 0.9)",
    labelColor: "#ffffff",
  },
  新西兰: {
    background: "linear-gradient(135deg, #00247d 0 58%, #ffffff 58% 65%, #cc142b 65% 100%)",
    borderColor: "#00247d",
    labelBackground: "rgba(0, 36, 125, 0.9)",
    labelColor: "#ffffff",
  },
  塞内加尔: {
    background: "linear-gradient(90deg, #00853f 0 33.33%, #fdef42 33.33% 66.66%, #e31b23 66.66% 100%)",
    borderColor: "#00853f",
    labelBackground: "rgba(0, 94, 53, 0.9)",
    labelColor: "#ffffff",
  },
  伊拉克: {
    background: "linear-gradient(180deg, #ce1126 0 33.33%, #ffffff 33.33% 66.66%, #000000 66.66% 100%)",
    borderColor: "#ce1126",
    labelBackground: "rgba(108, 0, 13, 0.9)",
    labelColor: "#ffffff",
  },
  挪威: {
    background:
      "linear-gradient(90deg, transparent 0 36%, #ffffff 36% 41%, #00205b 41% 53%, #ffffff 53% 58%, transparent 58%), linear-gradient(180deg, transparent 0 38%, #ffffff 38% 43%, #00205b 43% 57%, #ffffff 57% 62%, transparent 62%), #ba0c2f",
    borderColor: "#00205b",
    labelBackground: "rgba(0, 32, 91, 0.9)",
    labelColor: "#ffffff",
  },
  阿根廷: {
    background: "linear-gradient(180deg, #74acdf 0 33.33%, #ffffff 33.33% 66.66%, #74acdf 66.66% 100%)",
    borderColor: "#4f91c5",
    labelBackground: "rgba(28, 83, 130, 0.9)",
    labelColor: "#ffffff",
  },
  阿尔及利亚: {
    background: "linear-gradient(90deg, #006233 0 50%, #ffffff 50% 100%)",
    borderColor: "#006233",
    labelBackground: "rgba(0, 98, 51, 0.9)",
    labelColor: "#ffffff",
  },
  奥地利: {
    background: "linear-gradient(180deg, #ed2939 0 33.33%, #ffffff 33.33% 66.66%, #ed2939 66.66% 100%)",
    borderColor: "#ed2939",
    labelBackground: "rgba(160, 25, 39, 0.9)",
    labelColor: "#ffffff",
  },
  约旦: {
    background: "linear-gradient(150deg, #ce1126 0 30%, transparent 30%), linear-gradient(180deg, #000000 0 33.33%, #ffffff 33.33% 66.66%, #007a3d 66.66% 100%)",
    borderColor: "#007a3d",
    labelBackground: "rgba(0, 92, 52, 0.9)",
    labelColor: "#ffffff",
  },
  刚果民主共和国: {
    background: "linear-gradient(135deg, #007fff 0 42%, #f7d618 42% 52%, #ce1021 52% 60%, #f7d618 60% 70%, #007fff 70% 100%)",
    borderColor: "#007fff",
    labelBackground: "rgba(0, 85, 150, 0.9)",
    labelColor: "#ffffff",
  },
  克罗地亚: {
    background: "linear-gradient(180deg, #ff0000 0 33.33%, #ffffff 33.33% 66.66%, #171796 66.66% 100%)",
    borderColor: "#171796",
    labelBackground: "rgba(23, 23, 150, 0.9)",
    labelColor: "#ffffff",
  },
  加纳: {
    background: "linear-gradient(180deg, #ce1126 0 33.33%, #fcd116 33.33% 66.66%, #006b3f 66.66% 100%)",
    borderColor: "#006b3f",
    labelBackground: "rgba(0, 91, 58, 0.9)",
    labelColor: "#ffffff",
  },
  巴拿马: {
    background: "linear-gradient(90deg, #ffffff 0 50%, #d21034 50% 100%), linear-gradient(180deg, transparent 0 50%, #005293 50% 100%)",
    borderColor: "#005293",
    labelBackground: "rgba(0, 82, 147, 0.9)",
    labelColor: "#ffffff",
  },
  乌兹别克斯坦: {
    background: "linear-gradient(180deg, #1eb53a 0 28%, #ffffff 28% 36%, #ce1126 36% 42%, #ffffff 42% 50%, #0099b5 50% 100%)",
    borderColor: "#0099b5",
    labelBackground: "rgba(0, 121, 145, 0.9)",
    labelColor: "#ffffff",
  },
  哥伦比亚: {
    background: "linear-gradient(180deg, #fcd116 0 50%, #003893 50% 75%, #ce1126 75% 100%)",
    borderColor: "#003893",
    labelBackground: "rgba(0, 56, 147, 0.9)",
    labelColor: "#ffffff",
  },
};

export const getCountryTheme = (countryName: string): CountryTheme =>
  countryThemes[countryName] ?? fallbackTheme;
