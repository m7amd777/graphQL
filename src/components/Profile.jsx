export function Profile({ profile }) {
    if (!profile || !profile.data || !profile.data.user) {
        return <div>Loading...</div>;
    }

    const user = profile.data.user[0];

    return (
        <>
            <h1 style={{
                fontSize: "20px",
                color: "white"
            }}>Welcome back, {user.firstName} {user.lastName}!</h1>
            <div className="usercard">
                <div className="profile-image">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#38bdf8" />
                        <circle cx="30" cy="22" r="10" fill="white" />
                        <path d="M10 50C10 38 18 32 30 32C42 32 50 38 50 50" fill="white" />
                    </svg>
                </div>
                <div className="profile-info">
                    <div className="profile-username">{user.login}</div>
                    <div className="profile-stats">
                        <span>Assigned Audits: <strong>{user.auditsAssigned || 25}</strong></span>
                        <span className="stat-separator">•</span>
                        <span>Audit Ratio: <strong>{user.auditRatio.toFixed(2) || 1.1}</strong></span>
                    </div>
                </div>
            </div>
        </>
    );
}

