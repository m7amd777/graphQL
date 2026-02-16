import { useEffect, useMemo } from "react"
import { formatNumber } from "../utils/formatters.js"

export function Fgraph({ plot }) {

    const width = 800
    const height = 400
    const padding = 60
    // useEffect(() => {
    //     console.log(plot?.data?.transaction)
    // }, [plot])

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

    const maxXP = Math.max(...processed.map(p => p.totalXP), 0)

    function scaleX(index) {
        if (processed.length === 1) return width / 2
        return padding + (index / (processed.length - 1)) * (width - 2 * padding)
    }

    function scaleY(value) {
        if (!maxXP) return height - padding
        return height - padding - (value / maxXP) * (height - 2 * padding)
    }

    const pathData = processed
        .map((p, i) => {
            const x = scaleX(i)
            const y = scaleY(p.totalXP)
            return `${i === 0 ? "M" : "L"} ${x} ${y}`
        })
        .join(" ")

    return (
        <div
            style={{
                background: "#0f172a",
                padding: "30px",
                borderRadius: "0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                color: "white",
                maxWidth: "100%",
                maxHeight: "100%",
                overflowX: "auto"
            }}
        >
            <h2 style={{ marginBottom: "20px", fontSize:'30px'}}>
                XP Progression Across Completed projects
            </h2>

            <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                height="1200"
            >

                {/* Gradient */}
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>

                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>


                {/* Grid Lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = height - padding - ratio * (height - 2 * padding)
                    return (
                        <line
                            key={i}
                            x1={padding}
                            y1={y}
                            x2={width - padding}
                            y2={y}
                            stroke="rgba(255,255,255,0.08)"
                        />
                    )
                })}

                {/* Axes */}
                <line
                    x1={padding}
                    y1={height - padding}
                    x2={width - padding}
                    y2={height - padding}
                    stroke="rgba(255,255,255,0.3)"
                />
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="rgba(255,255,255,0.3)"
                />

                {/* Line */}
                {/* Area Under Curve */}
                <path
                    d={`${pathData} L ${scaleX(processed.length - 1)} ${height - padding} L ${scaleX(0)} ${height - padding} Z`}
                    fill="url(#areaGradient)"
                />

                {/* Animated Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    style={{
                        strokeDasharray: 2000,
                        strokeDashoffset: 2000,
                        animation: "drawLine 2s ease forwards"
                    }}
                />


                {/* Points + Labels */}
                {processed.map((p, i) => {
                    const x = scaleX(i)
                    const y = scaleY(p.totalXP)

                    return (
                        <g key={i}>

                            {/* Glow */}
                            <circle
                                cx={x}
                                cy={y}
                                r="8"
                                fill="rgba(56,189,248,0.2)"
                            />

                            {/* Main Point */}
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#38bdf8"
                            />

                            {/* XP Contribution */}
                            <text
                                x={x}
                                y={y - 14}
                                textAnchor="middle"
                                fontSize="9"
                                fill="#94a3b8"
                            >
                                +{formatNumber
                                    (p.amount)}
                            </text>

                            {/* Project Label (Rotated) */}
                            <text
                                x={x}
                                y={height - padding + 20}
                                transform={`rotate(-60, ${x}, ${height - padding + 20})`}
                                textAnchor="end"
                                fontSize="10"
                                fill="#cbd5e1"
                            >
                                {p.project}
                            </text>

                            {/* Date Label (Rotated) */}
                            <text
                                x={x}
                                y={height - padding + 40}
                                transform={`rotate(-60, ${x}, ${height - padding + 40})`}
                                textAnchor="end"
                                fontSize="9"
                                fill="#64748b"
                            >
                                {p.label}
                            </text>

                        </g>
                    )
                })}

                {/* Y Axis Max Label */}
                <text
                    x={padding - 10}
                    y={padding}
                    textAnchor="end"
                    fontSize="9"
                    fill="#cbd5e1"
                >
                    {formatNumber(maxXP)}
                </text>

            </svg>
        </div>
    )

}
