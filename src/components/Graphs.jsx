import { Sgraph } from "./SGraph"
import { Fgraph } from "./FGraph"
import { Audits } from "./Audits"



export function Graphs({ info }) {
    return (
        <>
            <div className="graphs">
                <Audits plot={info[2]} />
            </div>

            <div className="graphs-grid">
                <div className="graphs graph-half">
                    <Fgraph plot={info[0]} />
                </div>
                <div className="graphs graph-half">
                    <Sgraph plot={info[1]} />
                </div>
            </div>
        </>
    )
}