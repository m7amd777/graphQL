import { useMemo } from "react"
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from "../utils/formatters.js"

export function Fgraph({ plot }) {

    const processed = useMemo(() => {
        if (!plot?.data?.transaction.length) {
            console.log("empty")
            return []
        }

        // sort by date
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
    }, [plot])

    function formatDate(dateString) {
        const d = new Date(dateString)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div style={{
                    backgroundColor: '#1e293b',
                    padding: '10px',
                    border: '1px solid #38bdf8',
                    borderRadius: '4px',
                    color: 'white'
                }}>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}>
                        <strong>{data.project}</strong>
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '11px', color: '#94a3b8' }}>
                        {data.label}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '11px', color: '#38bdf8' }}>
                        Total XP: {formatNumber(data.totalXP)}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '11px', color: '#6366f1' }}>
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div
            style={{
                background: "#0f172a",
                padding: "30px",
                borderRadius: "0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                color: "white",
                width: "100%",
                maxWidth: "100%",
                height: "100%",
                marginBottom: "30px",
                boxSizing: "border-box",
            }}
        >
            <h2 style={{ marginBottom: "20px", fontSize: '30px' }}>
                XP Progression Across Completed Projects
            </h2>

            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={processed}
                    margin={{ top: 20, right: 80, left: 20, bottom: 80 }}
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
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: '#cbd5e1', fontSize: 10 }}
                        stroke="rgba(255,255,255,0.3)"
                    />

                    <YAxis
                        tickFormatter={(value) => formatNumber(value)}
                        tick={{ fill: '#cbd5e1', fontSize: 11 }}
                        stroke="rgba(255,255,255,0.3)"
                    />

                    <Tooltip content={<CustomTooltip />} />

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
                        strokeWidth={3}
                        dot={{ fill: '#38bdf8', r: 4 }}
                        activeDot={{ r: 6, fill: '#6366f1' }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )

}
