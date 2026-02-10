export function Auth({onLogin}) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fdata= new FormData(e.target)
        let username  =fdata.get("username")
        let password = fdata.get("password")


        const token = btoa(`${username}:${password}`);
        console.log("the encoded token is the following", token)

        const res = await fetch("https://learn.reboot01.com/api/auth/signin", {
        method: "POST",
        headers: {
            Authorization: `Basic ${token}`,
        },
        });

        if (!res.ok) {
            throw new Error("Login failed")
        }
        const data = await res.json();
        const jwt = data;
        console.log(jwt)
        localStorage.setItem("jwt", jwt);
        onLogin();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" id="username"></input>
                <label htmlFor="username">Username</label>
                <input type="password" name="password" id="password"></input>
                <label htmlFor="password">Password</label>
                <button type="submit" ></button>
            </form>
        </div>
    )
}
