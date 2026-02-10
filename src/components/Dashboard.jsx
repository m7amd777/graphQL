import { Profile } from "./Profile"
import { Graphs } from "./Graphs"

export function Dashboard ({onLogout}) {
    const logOut = () => {
        localStorage.removeItem("jwt")
        onLogout();
    }

    return (
        <>
        <button onClick={logOut}>Logout</button>
        <Profile/>
        <Graphs/>
        </>
    );
}