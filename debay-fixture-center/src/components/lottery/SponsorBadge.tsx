type SponsorBadgeProps = {
  sponsor: string;
};

export function SponsorBadge({ sponsor }: SponsorBadgeProps) {
  return (
    <span className="sponsor-badge">
      <span>特别鸣谢 sponsor</span>
      <strong>{sponsor}</strong>
    </span>
  );
}
