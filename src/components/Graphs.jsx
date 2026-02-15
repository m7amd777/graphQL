import { Sgraph } from "./SGraph"
import { Fgraph } from "./FGraph"
import { Audits } from "./Audits"



export function Graphs({info}){
    return (
        <>
            <div className="graphs">
                <Audits plot={info[2]}/>
            </div>
            <div className="graphs">
                <Fgraph plot={info[0]}/>
            </div>
            <div className="graphs">
                <Sgraph plot={info[1]}/>
            </div>
        </>
    )
}