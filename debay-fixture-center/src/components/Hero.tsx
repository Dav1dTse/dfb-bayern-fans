type HeroProps = {
  totalFixtures: number;
  bayernFixtures: number;
  selectedCount: number;
};

const bayernLogoSrc = "/brand/fc-bayern-muenchen-logo-2024.svg";

export function Hero({ totalFixtures, bayernFixtures, selectedCount }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero__texture" aria-hidden="true" />
      <div className="hero__kit-rails" aria-hidden="true">
        <span className="hero__kit-rail hero__kit-rail--germany" />
        <span className="hero__kit-rail hero__kit-rail--bayern" />
      </div>
      <img
        className="hero__bayern-watermark"
        src={bayernLogoSrc}
        alt=""
        aria-hidden="true"
      />
      <div className="hero__content">
        <div className="hero__badges" aria-label="德国队与拜仁元素">
          <span className="crest crest--germany">德国</span>
          <span className="crest crest--bayern" aria-label="FC Bayern München">
            <img src={bayernLogoSrc} alt="" />
          </span>
        </div>

        <div className="hero__identity-band" aria-label="德国队与拜仁主题">
          <span className="identity-tile identity-tile--germany">
            <strong>德国</strong>
          </span>
          <span className="identity-tile identity-tile--bayern">
            <img src={bayernLogoSrc} alt="" />
            <strong>拜仁</strong>
          </span>
        </div>

        <h1>德拜球迷赛程中心</h1>
        <p>
          按你的时区查看德国队与拜仁球员相关比赛，选择重点场次并导出日历。
        </p>

        <div className="hero__stats" aria-label="赛程摘要">
          <div>
            <strong>{totalFixtures}</strong>
            <span>场完整赛程</span>
          </div>
          <div>
            <strong>{bayernFixtures}</strong>
            <span>场拜仁相关</span>
          </div>
          <div>
            <strong>{selectedCount}</strong>
            <span>场已选择</span>
          </div>
        </div>
      </div>
    </header>
  );
}
