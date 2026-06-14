import type { ReactNode } from "react";

export function EmptyState({
  title = "暂无数据",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div>
        <span className="empty-state__mark">空</span>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
        {action && <div className="empty-state__action">{action}</div>}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "数据加载失败",
  description = "请稍后重试，或先查看本地 seed 数据。",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="error-state">
      <strong>{title}</strong>
      <p>{description}</p>
      {onRetry && (
        <button type="button" className="secondary-link-button" onClick={onRetry}>
          重试
        </button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ label = "正在加载数据..." }: { label?: string }) {
  return (
    <div className="loading-skeleton" aria-live="polite">
      <span />
      <span />
      <span />
      <strong>{label}</strong>
    </div>
  );
}

export function RefreshButton({
  onClick,
  label = "刷新数据",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button type="button" className="secondary-link-button" onClick={onClick}>
      {label}
    </button>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <span className="section-caption">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export function StatCompareBar({
  label,
  homeValue,
  awayValue,
}: {
  label: string;
  homeValue: number;
  awayValue: number;
}) {
  const total = Math.max(homeValue + awayValue, 1);
  const homePercent = Math.round((homeValue / total) * 100);

  return (
    <div className="stat-compare-bar">
      <div>
        <strong>{homeValue}</strong>
        <span>{label}</span>
        <strong>{awayValue}</strong>
      </div>
      <span className="stat-compare-bar__track">
        <span style={{ width: `${homePercent}%` }} />
      </span>
    </div>
  );
}
