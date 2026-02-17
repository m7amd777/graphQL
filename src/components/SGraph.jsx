import { Radar, RadarChart, PolarGrid, Tooltip, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useMemo } from 'react'

// #endregion
export function Sgraph({ plot }) {

    const sortedData = useMemo(() => {
        if (!plot?.data?.transaction || plot.data.transaction.length === 0) {
            console.log("empty")
            return []
        }
        // console.log("data", ...plot.data.transaction)
        const data = [...plot.data.transaction]
        const totals = data.reduce((acc, item) => {
            if (!acc[item.transaction_type.type]) {
                acc[item.transaction_type.type] = 0;
            }

            acc[item.transaction_type.type] += item.amount;
            return acc
        }, {})

        const aaa = Object.entries(totals)
            .map(([skill, total]) => ({ skill, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 6)

        console.log(aaa)
        const cleanedSkills = aaa.map(item => ({
            ...item,
            skill: item.skill.replace(/^skill_/, "")
        }));

        return cleanedSkills

    }, [plot])

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div style={{
                    backgroundColor: '#1e293b',
                    padding: '10px',
                    border: '1px solid #8884d8',
                    borderRadius: '4px',
                    color: 'white'
                }}>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}>skill: {data.skill}</p>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}>amount : {data.total}</p>
                </div>
            )
        }
        return null
    }


    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#0f172a' }}>
            <span className="audit-tooltip" id="tooltip2">
                <h2 style={{ color: '#fff', fontSize: '30px' }}>Skills Amount Distribution</h2>
                <span className="info-icon" aria-label="What does this mean?">ⓘ</span>
                <span className="tooltip-text" id="tooltip2txt">
                    ps: the graphs in the intra is based on the completion rate. this graph is only based on the amount of the transaction                </span>

            </span>
            <RadarChart
                style={{
                    backgroundColor: '#0f172a',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    aspectRatio: 1,
                    padding: '0',
                    boxShadow: '0 10px 0 rgba(0,0,0,0.4)',
                    fontSize: "20px"
                }}
                responsive
                outerRadius="80%"
                data={sortedData}
                margin={{
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 20,
                }}
            >
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis />
                <Tooltip content={<CustomTooltip />} />
                <Radar name="skills" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
        </div>
    );
};

