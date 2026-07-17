import React, { useState } from 'react';

type MetricKey = 'active' | 'repeat' | 'visitor' | 'conversion';

const metricData: Record<MetricKey, { title: string; value: string; points: number[]; tooltipVal: string; yMax: number }> = {
    active: {
        title: 'Active Customers',
        value: '25k',
        points: [18000, 22000, 38000, 32000, 25409, 40000, 38000],
        tooltipVal: '25,409',
        yMax: 50000
    },
    repeat: {
        title: 'Repeat Customers',
        value: '5.6k',
        points: [3000, 4200, 5600, 4800, 5200, 6100, 5800],
        tooltipVal: '5,200',
        yMax: 8000
    },
    visitor: {
        title: 'Shop Visitor',
        value: '250k',
        points: [120000, 150000, 250000, 220000, 180000, 240000, 230000],
        tooltipVal: '180,000',
        yMax: 300000
    },
    conversion: {
        title: 'Conversion Rate',
        value: '5.5%',
        points: [4.2, 4.8, 5.5, 5.0, 5.2, 5.8, 5.5],
        tooltipVal: '5.2%',
        yMax: 8
    }
};

// Generate spline SVG path
const getSplinePath = (dataPoints: number[], max: number) => {
    const coords = dataPoints.map((val, i) => ({
        x: 45 + i * (490 / 6),
        y: 165 - (val / max) * 150
    }));

    let path = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
        const curr = coords[i];
        const next = coords[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 2;
        const cp1y = curr.y;
        const cp2x = curr.x + (next.x - curr.x) / 2;
        const cp2y = next.y;
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return path;
};

const CustomerOverviewChart: React.FC = () => {
    const [activeMetric, setActiveMetric] = useState<MetricKey>('active');

    const currentMetric = metricData[activeMetric];
    const chartLinePath = getSplinePath(currentMetric.points, currentMetric.yMax);
    const chartAreaPath = `${chartLinePath} L 535,165 L 45,165 Z`;

    // Coordinates for Thursday tooltip (Index 4)
    const thuValue = currentMetric.points[4];
    const thuX = 45 + 4 * (490 / 6);
    const thuY = 165 - (thuValue / currentMetric.yMax) * 150;

    return (
        <div className="overview-chart-card">
            <div className="chart-card-header">
                <h2>Customer Overview</h2>
                <div className="chart-timeframe-controls">
                    <button className="timeframe-pill active">This week</button>
                    <button className="timeframe-pill">Last week</button>
                </div>
            </div>

            {/* Swappable sub-metric tabs */}
            <div className="chart-metrics-tabs">
                <button
                    className={`metric-tab-button ${activeMetric === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveMetric('active')}
                >
                    <span className="tab-label">Active Customers</span>
                    <span className="tab-value">25k</span>
                </button>
                <button
                    className={`metric-tab-button ${activeMetric === 'repeat' ? 'active' : ''}`}
                    onClick={() => setActiveMetric('repeat')}
                >
                    <span className="tab-label">Repeat Customers</span>
                    <span className="tab-value">5.6k</span>
                </button>
                <button
                    className={`metric-tab-button ${activeMetric === 'visitor' ? 'active' : ''}`}
                    onClick={() => setActiveMetric('visitor')}
                >
                    <span className="tab-label">Shop Visitor</span>
                    <span className="tab-value">250k</span>
                </button>
                <button
                    className={`metric-tab-button ${activeMetric === 'conversion' ? 'active' : ''}`}
                    onClick={() => setActiveMetric('conversion')}
                >
                    <span className="tab-label">Conversion Rate</span>
                    <span className="tab-value">5.5%</span>
                </button>
            </div>

            {/* Spline Chart Canvas */}
            <div className="chart-render-wrapper">
                <svg viewBox="0 0 550 200" width="100%" height="100%">
                    <defs>
                        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--dash-green)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--dash-green)" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal gridlines */}
                    {[15, 45, 75, 105, 135, 165].map((y, index) => (
                        <line
                            key={index}
                            x1="45"
                            y1={y}
                            x2="535"
                            y2={y}
                            className="chart-grid-line"
                        />
                    ))}

                    {/* Y-axis Labels */}
                    {['50k', '40k', '30k', '20k', '10k', '0k'].map((label, index) => (
                        <text
                            key={index}
                            x="30"
                            y={15 + index * 30 + 4}
                            className="chart-axis-text"
                            textAnchor="end"
                        >
                            {activeMetric === 'repeat' ? `${8 - index * 1.5}k` :
                                activeMetric === 'conversion' ? `${8 - index * 1.5}%` :
                                    activeMetric === 'visitor' ? `${300 - index * 60}k` : label}
                        </text>
                    ))}

                    {/* X-axis Labels */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                        const x = 45 + index * (490 / 6);
                        const isWed = day === 'Wed';
                        return (
                            <text
                                key={index}
                                x={x}
                                y="188"
                                className="chart-axis-text"
                                textAnchor="middle"
                                style={{
                                    fontWeight: isWed ? '800' : '500',
                                    fill: isWed ? 'var(--dash-green)' : 'var(--dash-text-muted)'
                                }}
                            >
                                {day}
                            </text>
                        );
                    })}

                    {/* Gradient Area Fill */}
                    <path d={chartAreaPath} className="chart-area-fill" />

                    {/* Spline Curve Path */}
                    <path d={chartLinePath} className="chart-line-path" />

                    {/* Tooltip Vertical Dotted Indicator */}
                    <line x1={thuX} y1={thuY} x2={thuX} y2="165" className="chart-tooltip-line" />

                    {/* Highlighted Thursday Marker */}
                    <circle cx={thuX} cy={thuY} className="chart-point-marker" />
                </svg>

                {/* Floating Tooltip Div */}
                <div
                    className="chart-tooltip-badge"
                    style={{ left: `${(thuX / 550) * 100}%`, top: `${(thuY / 200) * 100}%` }}
                >
                    Thursday {currentMetric.tooltipVal}
                </div>
            </div>
        </div>
    );
};

export default CustomerOverviewChart;
