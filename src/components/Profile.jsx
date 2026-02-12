export function Profile({ profile }) {
    if (!profile || !profile.data || !profile.data.user) {
        return <div>Loading...</div>;
    }

    const user = profile.data.user[0];

    return (
        <div className="usercard">
            <div>
                <h1>{user.login}</h1>
            </div>
            <div>
                <h1>Score: {user.auditsAssigned || 25}</h1>
                <h1>Audit ratio: {user.auditRatio.toFixed(2) || 1.1}</h1>
            </div>
        </div>
    );
}

