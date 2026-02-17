import { useEffect, useState } from "react";
import { formatNumber, calculateXpByPath, getPathName } from "../utils/formatters";

export function Profile({ profile, onLogout }) {
    // if (!profile || !profile.data || !profile.data.user) {
    //     return <div>Loading...</div>;
    // }
    const [expandXp, setExpandXp] = useState(false);

    if (profile.length === 0) {
        return <div>Loading...</div>;
    }
    const userSlice = profile[0]
    const xpSlice = profile[1]
    const levelSlice = profile[2]
    const user = userSlice.data.user[0];
    const xps = xpSlice.data.transaction
    const level = levelSlice.data.transaction[0].amount
    const totalxp = xps.reduce((acc, xp) => { return acc + xp.amount }, 0)
    const xpByPath = calculateXpByPath(xps)


    const logOut = () => {
        localStorage.removeItem("jwt")
        onLogout();
    }

    return (
        <>
            <div className="greetwlogout">
                <h1 style={{
                    fontSize: "20px",
                    color: "white"
                }}>Welcome back, {user.firstName} {user.lastName}!</h1>
                <button onClick={logOut}>Logout</button>
            </div>


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
                        <span className="audit-tooltip">
                            Total Audits Assigned By System: <strong>{user.auditsAssigned || 25}</strong>
                            <span className="info-icon" aria-label="What does this mean?">ⓘ</span>
                            <span className="tooltip-text">
                                This is the total number of audits the system assigned to you with an end date (not the number you have available).
                            </span>
                        </span>
                        <span className="stat-separator">•</span>
                        <span>Audit Ratio: <strong>{user.auditRatio.toFixed(2) || 1.1}</strong></span>
                        <span className="stat-separator">•</span>
                        <span>Level: <strong>{level}</strong></span>
                    </div>
                    <div className="xp-section">
                        <div
                            className="xp-header"
                            onClick={() => setExpandXp(!expandXp)}
                            style={{
                                cursor: "pointer",
                                padding: "12px 14px",
                                backgroundColor: "#1e293b",
                                borderRadius: "6px",
                                marginTop: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                transition: "background-color 0.2s ease",
                                border: "1px solid #334155"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#293548"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                        >
                            <span style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>
                                Total Lifetime XP: <strong style={{ color: "#38bdf8", fontWeight: "700" }}>{formatNumber(totalxp)}</strong>
                            </span>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                                {expandXp ? "▼" : "▶"} ({xpByPath.length} paths)
                            </span>
                        </div>

                        {expandXp && (
                            <div style={{
                                marginTop: "8px",
                                backgroundColor: "#0f172a",
                                borderRadius: "6px",
                                padding: "16px",
                                maxHeight: "500px",
                                overflowY: "auto",
                                border: "1px solid #1e293b"
                            }}>
                                <table style={{
                                    width: "100%",
                                    color: "#e2e8f0",
                                    borderCollapse: "collapse",
                                    fontSize: "13px"
                                }}>
                                    <thead>
                                        <tr style={{
                                            borderBottom: "2px solid #38bdf8",
                                            backgroundColor: "#1e293b"
                                        }}>
                                            <th style={{
                                                textAlign: "left",
                                                padding: "10px 12px",
                                                fontWeight: "700",
                                                color: "#38bdf8",
                                                fontSize: "12px"
                                            }}>Path</th>
                                            <th style={{
                                                textAlign: "right",
                                                padding: "10px 12px",
                                                fontWeight: "700",
                                                color: "#38bdf8",
                                                fontSize: "12px"
                                            }}>Amount</th>
                                            <th style={{
                                                textAlign: "right",
                                                padding: "10px 12px",
                                                fontWeight: "700",
                                                color: "#38bdf8",
                                                fontSize: "12px"
                                            }}>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {xpByPath.map((item, index) => (
                                            <tr key={index} style={{
                                                borderBottom: "1px solid #334155",
                                                backgroundColor: index % 2 === 0 ? "transparent" : "rgba(30, 41, 59, 0.5)",
                                                transition: "background-color 0.15s ease"
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)"}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "transparent" : "rgba(30, 41, 59, 0.5)"}
                                            >
                                                <td style={{
                                                    padding: "10px 12px",
                                                    color: "#cbd5e1",
                                                    fontWeight: "500"
                                                }}>
                                                    {getPathName(item.path)}
                                                </td>
                                                <td style={{
                                                    textAlign: "right",
                                                    padding: "10px 12px",
                                                    color: "#38bdf8",
                                                    fontWeight: "600"
                                                }}>
                                                    {item.formatted}
                                                </td>
                                                <td style={{
                                                    textAlign: "right",
                                                    padding: "10px 12px",
                                                    color: "#a1e9e1",
                                                    fontWeight: "500"
                                                }}>
                                                    {((item.amount / totalxp) * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
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

