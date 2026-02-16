import { useState } from 'react';

export function Audits({ plot }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    if (!plot || !plot.data || !plot.data.user) {
        return <div style={{ color: 'white', padding: '20px' }}>Loading audits...</div>;
    }

    const audits = plot.data.user[0]?.audits || [];

    // Sort audits by createdAt date (most recent first)
    const sortedAudits = [...audits].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Pagination calculations
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
        <div style={{
            backgroundColor: '#0f172a',
            padding: '30px',
            borderRadius: '0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            color: 'white'
        }}>
            <h2 style={{ marginBottom: '20px' , fontSize: '30px'}}>Audit History</h2>

            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Created</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>End Date</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Captain</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAudits.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                    No audits found
                                </td>
                            </tr>
                        ) : (
                            currentAudits.map((audit, index) => (
                                <tr key={index} style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'background-color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{formatDate(audit.createdAt)}</td>
                                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{formatDate(audit.endAt)}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            backgroundColor: getStatusStyle(audit.closureType).bg,
                                            color: getStatusStyle(audit.closureType).color
                                        }}>
                                            {getStatusStyle(audit.closureType).text}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{audit.group?.captainLogin || 'N/A'}</td>
                                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '12px' }}>{audit.group?.path || 'N/A'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Total Audits: <strong style={{ color: '#38bdf8' }}>{sortedAudits.length}</strong>
                    <span style={{ marginLeft: '15px' }}>
                        Showing {startIndex + 1}-{Math.min(endIndex, sortedAudits.length)} of {sortedAudits.length}
                    </span>
                </div>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: currentPage === 1 ? '#1e293b' : '#38bdf8',
                                color: currentPage === 1 ? '#64748b' : 'white',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Previous
                        </button>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: currentPage === totalPages ? '#1e293b' : '#38bdf8',
                                color: currentPage === totalPages ? '#64748b' : 'white',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}