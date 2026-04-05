import { useState } from 'react';

export function Audits({ plot }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    if (!plot || !plot.data || !plot.data.user) {
        return <div style={{ color: 'white', padding: '20px' }}>Loading audits...</div>;
    }

    const audits = plot.data.user[0]?.audits || [];

    const sortedAudits = [...audits].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const totalPages = Math.ceil(sortedAudits.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAudits = sortedAudits.slice(startIndex, endIndex);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusStyle = (closureType) => {
        const status = closureType || 'N/A';
        const styles = {
            'N/A': { bg: 'rgba(56,189,248,0.2)', color: '#38bdf8', text: 'available' },
            'unused': { bg: 'rgba(168,85,247,0.2)', color: '#a855f7', text: 'unused' },
            'succeeded': { bg: 'rgba(34,197,94,0.2)', color: '#22c55e', text: 'succeeded' },
            'expired': { bg: 'rgba(239,68,68,0.2)', color: '#ef4444', text: 'expired' }
        };
        return styles[status] || { bg: 'rgba(148,163,184,0.2)', color: '#94a3b8', text: status };
    };

    return (
        <div className="panel audit-panel">
            <div className="panel-header">
                <h2 className="panel-title">Audit History</h2>
                <p className="panel-subtitle">Your latest audits, optimized for smaller screens.</p>
            </div>

            <div className="audit-table-wrap">
                <table className="audit-table">
                    <thead>
                        <tr>
                            <th>Created</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Captain</th>
                            <th>Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAudits.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="audit-empty">
                                    No audits found
                                </td>
                            </tr>
                        ) : (
                            currentAudits.map((audit, index) => (
                                <tr key={index} className="audit-row">
                                    <td>{formatDate(audit.createdAt)}</td>
                                    <td>{formatDate(audit.endAt)}</td>
                                    <td>
                                        <span
                                            className="audit-status"
                                            style={{
                                                backgroundColor: getStatusStyle(audit.closureType).bg,
                                                color: getStatusStyle(audit.closureType).color
                                            }}
                                        >
                                            {getStatusStyle(audit.closureType).text}
                                        </span>
                                    </td>
                                    <td>{audit.group?.captainLogin || 'N/A'}</td>
                                    <td className="audit-path-cell">{audit.group?.path || 'N/A'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="audit-cards">
                {currentAudits.length === 0 ? (
                    <div className="audit-empty">No audits found</div>
                ) : (
                    currentAudits.map((audit, index) => (
                        <article key={index} className="audit-card">
                            <div className="audit-card-top">
                                <div className="audit-card-path">{audit.group?.path || 'N/A'}</div>
                                <span
                                    className="audit-status"
                                    style={{
                                        backgroundColor: getStatusStyle(audit.closureType).bg,
                                        color: getStatusStyle(audit.closureType).color
                                    }}
                                >
                                    {getStatusStyle(audit.closureType).text}
                                </span>
                            </div>

                            <div className="audit-card-grid">
                                <div>
                                    <span className="audit-meta-label">Created</span>
                                    <span className="audit-meta-value">{formatDate(audit.createdAt)}</span>
                                </div>
                                <div>
                                    <span className="audit-meta-label">End Date</span>
                                    <span className="audit-meta-value">{formatDate(audit.endAt)}</span>
                                </div>
                                <div>
                                    <span className="audit-meta-label">Captain</span>
                                    <span className="audit-meta-value">{audit.group?.captainLogin || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="audit-meta-label">Team</span>
                                    <span className="audit-meta-value">{audit.group?.object?.name || 'N/A'}</span>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="audit-footer">
                <div className="audit-summary">
                    Total Audits: <strong>{sortedAudits.length}</strong>{' '}
                    Showing {sortedAudits.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, sortedAudits.length)} of {sortedAudits.length}
                </div>

                {totalPages > 1 && (
                    <div className="audit-pagination">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="audit-pagination-status">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
