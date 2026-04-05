import { Radar, RadarChart, PolarGrid, Tooltip, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react'

function buildSkillData(plot) {
    if (!plot?.data?.transaction?.length) {
        return []
    }

    const totals = plot.data.transaction.reduce((acc, item) => {
        if (!acc[item.transaction_type.type]) {
            acc[item.transaction_type.type] = 0;
        }

        acc[item.transaction_type.type] += item.amount;
        return acc
    }, {})

    return Object.entries(totals)
        .map(([skill, total]) => ({
            skill: skill.replace(/^skill_/, ""),
            total
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 6)
}

function SkillsTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="chart-tooltip chart-tooltip--radar">
                <p>Skill: {data.skill}</p>
                <p>Amount: {data.total}</p>
            </div>
        )
    }
    return null
}

export function Sgraph({ plot }) {
    const [isCompact, setIsCompact] = useState(() => window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => setIsCompact(window.innerWidth < 768)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const sortedData = buildSkillData(plot)

    return (
        <div className="panel">
            <div className="panel-header">
                <span className="audit-tooltip" id="tooltip2">
                    <h2 className="panel-title">Skills Amount Distribution</h2>
                    <span className="info-icon" aria-label="What does this mean?">(i)</span>
                    <span className="tooltip-text" id="tooltip2txt">
                        The intra graphs use completion rate. This view is based only on transaction amount.
                    </span>
                </span>
            </div>

            <div className="chart-shell chart-shell--radar">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        outerRadius={isCompact ? "68%" : "80%"}
                        data={sortedData}
                        margin={{
                            top: isCompact ? 8 : 20,
                            left: isCompact ? 4 : 20,
                            right: isCompact ? 4 : 20,
                            bottom: isCompact ? 8 : 20,
                        }}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#cbd5e1', fontSize: isCompact ? 10 : 12 }} />
                        <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: isCompact ? 9 : 11 }} />
                        <Tooltip content={<SkillsTooltip />} />
                        <Radar name="skills" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
