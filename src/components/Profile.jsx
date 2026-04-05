import { useMemo, useState } from "react";
import { formatNumber, calculateXpByPath, getPathName } from "../utils/formatters";
import { CiLogout } from "react-icons/ci";



export function Profile({ profile, onLogout }) {
    const [expandXp, setExpandXp] = useState(false);

    const userSlice = profile?.[0]
    const xpSlice = profile?.[1]
    const levelSlice = profile?.[2]

    const user = userSlice?.data?.user?.[0] ?? null;
    const xps = xpSlice?.data?.transaction ?? []
    const level = levelSlice?.data?.transaction?.[0]?.amount ?? 0

    const totalxp = useMemo(
        () => xps?.reduce((acc, xp) => acc + (xp.amount || 0), 0),
        [xps]
    )

    const xpByPath = useMemo(() => calculateXpByPath(xps), [xps])

    const logOut = () => {
        localStorage.removeItem("jwt")
        onLogout();
    }

    if (!profile?.length || !user || !xpSlice?.data?.transaction || !levelSlice?.data?.transaction?.[0]) {
        return <div>Loading...</div>;
    }

    const initials =
        `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
        user.login?.slice(0, 2).toUpperCase() ||
        "U";

    return (
        <>
            <div className="greetwlogout">
                <h1 className="greet-title">Welcome back, {user.firstName} {user.lastName}!</h1>
                <button className="logoutbtn" onClick={logOut}><CiLogout /></button>
            </div>


            <div className="usercard">
                <div className="profile-avatar">{initials}</div>

                <div className="profile-info">
                    <div className="profile-header">
                        <div className="profile-name-wrap">
                            <div className="profile-name">{user.login}</div>
                            <div className="profile-email">{user.email}</div>
                        </div>
                    </div>

                    <div className="profile-stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Audit Ratio</div>
                            <div className="stat-value">{Number(user.auditRatio ?? 0).toFixed(2)}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Current Level</div>
                            <div className="stat-value">{level}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total XP</div>
                            <div className="stat-value">{formatNumber(totalxp)}</div>
                        </div>
                    </div>

                    <div className="xp-section">
                        <div className="xp-header" onClick={() => setExpandXp((value) => !value)}>
                            <span>XP by path</span>
                            <span>{expandXp ? "▼" : "▶"} ({xpByPath.length})</span>
                        </div>

                        {expandXp && (
                            <div className="xp-table-wrap">
                                <table className="xp-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Path</th>
                                            <th>XP</th>
                                            <th>Share</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {xpByPath.map((item, index) => {
                                            const percentage = totalxp ? (item.amount / totalxp) * 100 : 0;
                                            return (
                                                <tr key={item.path}>
                                                    <td>{index + 1}</td>
                                                    <td>{getPathName(item.path)}</td>
                                                    <td>{item.formatted}</td>
                                                    <td>
                                                        <div className="xp-share">
                                                            <span>{percentage.toFixed(1)}%</span>
                                                            <div className="xp-share-bar">
                                                                <div
                                                                    className="xp-share-fill"
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

