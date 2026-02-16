import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
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

        console.log(totals)
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




    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#0f172a' }}>
            <h2 style={{ color: '#fff', fontSize: '30px' }}>Skills Amount Distribution (not completion rate)</h2>
            <RadarChart
            style={{ backgroundColor: '#0f172a', 
                width: '100%', 
                height: '100%',
                maxWidth: '100%', 
                maxHeight: '80vh', 
                aspectRatio: 1,
                backgroundColor: '#0f172a',
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
            <Radar name="skills" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
        </div>
    );
};

