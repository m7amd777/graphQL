import { Profile } from "./Profile"
import { Graphs } from "./Graphs"
import { useEffect, useState } from "react"
import { userinfo, auditinfo } from "../queries/UserData"
import { trans1, skills } from "../queries/GraphQueries"


export function Dashboard({ onLogout }) {
    const [data, setdata] = useState([])

    useEffect(() => {
        fetchAll();
    }, [])  // Empty array = run once on mount

    const logOut = () => {
        localStorage.removeItem("jwt")
        onLogout();
    }

    async function fetchAll() {
        const queryItems = [userinfo(), trans1(), skills(), auditinfo()]

        const results = await Promise.all(
            queryItems.map(item => fetchQuery(item))
        )

        console.log(results)
        setdata(results)
        return results
    }


    async function fetchQuery(q) {

        console.log("fetching the query, ", q)
        const token = localStorage.getItem("jwt")
        console.log("token", token)

        const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: q
            })

        });

        if (!res.ok) {
            console.log("error in the response")
            return
        }
        const data = await res.json();
        return data
    }



    return (
        <>
            <button onClick={logOut}>Logout</button>
            <Profile profile={data[0]} />
            <Graphs info={data.slice(1)}/>
        </>
    );
}

