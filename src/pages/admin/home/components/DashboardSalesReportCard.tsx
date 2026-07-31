import React from 'react';
import type { SalesReportItem } from '../../../../interface/dashboard.interface';

interface DashboardSalesReportCardProps {
  report: SalesReportItem[];
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const DashboardSalesReportCard: React.FC<DashboardSalesReportCardProps> = ({ report }) => {
  const maxTotal = Math.max(1, ...report.map((r) => r.total));

  return (
    <div className="home-card home-sales-report-card">
      <div className="home-card-title-row">
        <h2>Report for this week</h2>
      </div>

      {report.length === 0 ? (
        <p className="home-empty-hint">Aún no hay ventas registradas esta semana.</p>
      ) : (
        <div className="home-sales-report-bars">
          {report.map((day) => {
            const date = new Date(`${day.date}T00:00:00`);
            const label = Number.isNaN(date.getTime())
              ? day.date
              : date.toLocaleDateString('es-CO', { weekday: 'short' });
            const heightPct = (day.total / maxTotal) * 100;
            return (
              <div className="home-sales-report-bar-col" key={day.date} title={currencyFormatter.format(day.total)}>
                <div className="home-sales-report-bar-track">
                  <div className="home-sales-report-bar-fill" style={{ height: `${heightPct}%` }} />
                </div>
                <span className="home-sales-report-bar-label">{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardSalesReportCard;
