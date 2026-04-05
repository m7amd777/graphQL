import { useEffect, useState } from "react"
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from "../utils/formatters.js"

function formatDate(dateString) {
    const d = new Date(dateString)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function buildProcessedData(plot) {
    if (!plot?.data?.transaction?.length) {
        return []
    }

    const sorted = [...plot.data.transaction].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )

    let cumulative = 0

    return sorted.map((item) => {
        cumulative += item.amount
        return {
            date: new Date(item.createdAt),
            label: formatDate(item.createdAt),
            amount: item.amount,
            totalXP: cumulative,
            project: item.object?.name || "unknown"
        }
    })
}

function XpTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="chart-tooltip">
                <p><strong>{data.project}</strong></p>
                <p className="chart-tooltip-meta">{data.label}</p>
                <p className="chart-tooltip-value">Total XP: {formatNumber(data.totalXP)}</p>
            </div>
        )
    }
    return null
}

export function Fgraph({ plot }) {
    const [isCompact, setIsCompact] = useState(() => window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => setIsCompact(window.innerWidth < 768)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const processed = buildProcessedData(plot)

    return (
        <div className="panel">
            <div className="panel-header">
                <h2 className="panel-title">XP Progression Across Completed Projects</h2>
                <p className="panel-subtitle">Cumulative growth over time, with tighter labels on phones.</p>
            </div>

            <div className="chart-shell">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={processed}
                        margin={isCompact ? { top: 12, right: 10, left: -18, bottom: 18 } : { top: 20, right: 24, left: 4, bottom: 64 }}
                    >
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

                        <XAxis
                            dataKey="project"
                            angle={isCompact ? 0 : -35}
                            textAnchor={isCompact ? "middle" : "end"}
                            interval={isCompact ? "preserveStartEnd" : 0}
                            minTickGap={isCompact ? 24 : 8}
                            height={isCompact ? 42 : 86}
                            tick={{ fill: '#cbd5e1', fontSize: isCompact ? 9 : 10 }}
                            stroke="rgba(255,255,255,0.3)"
                        />

                        <YAxis
                            width={isCompact ? 46 : 60}
                            tickFormatter={(value) => formatNumber(value)}
                            tick={{ fill: '#cbd5e1', fontSize: isCompact ? 10 : 11 }}
                            stroke="rgba(255,255,255,0.3)"
                        />

                        <Tooltip content={<XpTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="totalXP"
                            fill="url(#colorGradient)"
                            stroke="none"
                        />

                        <Line
                            type="monotone"
                            dataKey="totalXP"
                            stroke="#38bdf8"
                            strokeWidth={isCompact ? 2 : 3}
                            dot={{ fill: '#38bdf8', r: isCompact ? 2 : 4 }}
                            activeDot={{ r: isCompact ? 4 : 6, fill: '#6366f1' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
