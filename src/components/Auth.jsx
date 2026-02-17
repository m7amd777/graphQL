export function Auth({ onLogin }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fdata = new FormData(e.target)
        let username = fdata.get("username")
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
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Reboot 01</h1>
                    <p>Sign in to your account</p>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username or Email</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter your username or email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Sign In</button>
                </form>
                <div className="auth-footer">
                    <p>© 2024 Reboot 01. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}
