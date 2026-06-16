import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const BASE_URL = "http://localhost:8080/documents";

function AlertsPage() {
    const navigate = useNavigate();

    const [expiring, setExpiring] = useState([]);
    const [expired, setExpired] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            const [expiringRes, expiredRes] = await Promise.all([
                fetch(`${BASE_URL}/expiring`, { credentials: "include" }),
                fetch(`${BASE_URL}/expired`, { credentials: "include" })
            ]);

            const expiringData = await expiringRes.json();
            const expiredData = await expiredRes.json();

            setExpiring(expiringData);
            setExpired(expiredData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (documentId) => {
        try {
            await fetch(`${BASE_URL}/${documentId}/validity/read`, {
                method: "PUT",
                credentials: "include"
            });
            loadAlerts();
        } catch (err) {
            console.error(err);
        }
    };

    const markAsUnread = async (documentId) => {
        try {
            await fetch(`${BASE_URL}/${documentId}/validity/unread`, {
                method: "PUT",
                credentials: "include"
            });
            loadAlerts();
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            method: "GET",
            credentials: "include"
        });
        localStorage.clear();
        navigate("/");
    };

    const formatType = (type) => {
        switch (type) {
            case "MEDICALEXAM": return "Medical exam";
            case "CONTRACT": return "Contract";
            case "CERTIFICATE": return "Certificate";
            case "EXAMRESULT": return "Exam result";
            default: return type;
        }
    };

    const renderSection = (title, docs, headerColor, dotColor) => {
        const unread = docs.filter(d => !d.isRead);
        const read = docs.filter(d => d.isRead);
        

        return (
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <span style={{ ...styles.dot, backgroundColor: dotColor }}></span>
                    <h2 style={styles.sectionTitle}>
                        {title} ({docs.length})
                    </h2>
                </div>

                {unread.length > 0 && (
                    <>
                        {title !== "Expired" && (
                        <p style={styles.subLabel}>Unread</p>
                        )}
                            <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={{ ...styles.tableHeader, backgroundColor: headerColor }}>
                                        <th style={styles.th}>Document name</th>
                                        <th style={styles.th}>Candidate</th>
                                        <th style={styles.th}>Type</th>
                                        <th style={styles.th}>Expiry date</th>
                                        <th style={styles.th}>Days left</th>
                                        <th style={styles.th}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unread.map((doc, index) => (
                                        <tr
                                            key={doc.documentsId}
                                            style={{
                                                ...styles.tableRow,
                                                backgroundColor: index % 2 === 0 ? "#fffdf0" : "#fff9e6",
                                                fontWeight: "500"
                                            }}
                                        >
                                            <td style={styles.td}>{doc.docsTitle}</td>
                                            <td style={styles.td}>{doc.candidateName || "-"}</td>
                                            <td style={styles.td}>{formatType(doc.documentType)}</td>
                                            <td style={styles.td}>{doc.docsExpireDate || "-"}</td>
                                            <td style={styles.td}>
                                                {doc.daysUntilExpiry !== null && doc.daysUntilExpiry !== undefined
                                                    ? doc.daysUntilExpiry > 0
                                                        ? `${doc.daysUntilExpiry} days`
                                                        : "Expired"
                                                    : "-"
                                                }
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.btnGroup}>
                                                    <button
                                                        style={styles.openBtn}
                                                        onClick={() => navigate(`/employee/documents/${doc.documentsId}`)}
                                                    >
                                                        Open
                                                    </button>
                                                    {doc.docsStatus === "EXPIRING_SOON" && (
                                                        <button
                                                            style={styles.readBtn}
                                                            onClick={() => markAsRead(doc.documentsId)}
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {read.length > 0 && (
                    <>
                        <p style={styles.subLabel}>Read</p>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={{ ...styles.tableHeader, backgroundColor: "#888" }}>
                                        <th style={styles.th}>Document name</th>
                                        <th style={styles.th}>Type</th>
                                        <th style={styles.th}>Expiry date</th>
                                        <th style={styles.th}>Days left</th>
                                        <th style={styles.th}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {read.map((doc, index) => (
                                        <tr
                                            key={doc.documentsId}
                                            style={{
                                                ...styles.tableRow,
                                                backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
                                                opacity: 0.7
                                            }}
                                        >
                                            <td style={styles.td}>{doc.docsTitle}</td>
                                            <td style={styles.td}>{formatType(doc.documentType)}</td>
                                            <td style={styles.td}>{doc.docsExpireDate || "-"}</td>
                                            <td style={styles.td}>
                                                {doc.daysUntilExpiry !== null && doc.daysUntilExpiry !== undefined
                                                    ? doc.daysUntilExpiry > 0
                                                        ? `${doc.daysUntilExpiry} days`
                                                        : "Expired"
                                                    : "-"
                                                }
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.btnGroup}>
                                                    <button
                                                        style={styles.openBtn}
                                                        onClick={() => navigate(`/employee/documents/${doc.documentsId}`)}
                                                    >
                                                        Open
                                                    </button>
                                                    {doc.docsStatus === "EXPIRING_SOON" && (
                                                        <button
                                                            style={styles.readBtn}
                                                            onClick={() => markAsUnread(doc.documentsId)}
                                                        >
                                                            Mark as unread
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {docs.length === 0 && (
                    <div style={styles.emptyBox}>No alerts.</div>
                )}
            </div>
        );
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <div style={styles.container}>

            <Sidebar
                logout={logout}
                buttons={[
                    { label: "Home",       onClick: () => navigate("/employee") },
                    { label: "Documents",  onClick: () => navigate("/employee/documents") },
                    { label: "Candidates", onClick: () => navigate("/employee/candidates") },
                    { label: "Alerts",     onClick: () => navigate("/employee/alerts") },
                    { label: "Archive",    onClick: () => navigate("/employee/archive") },
                    { label: "My Profile", onClick: () => navigate("/employee/profile") },
                ]}
            />

            <div style={styles.main}>

                <h1 style={styles.title}>Alerts</h1>

                {renderSection("Expiring soon", expiring, "#856404", "#f0ad4e")}
                {renderSection("Expired", expired, "#721c24", "#d9534f")}

            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        fontFamily: "Arial"
    },
    main: {
        flex: 1,
        padding: "40px"
    },
    title: {
        color: "#1e3c72",
        fontSize: "28px",
        marginBottom: "32px"
    },
    section: {
        marginBottom: "48px"
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "16px"
    },
    sectionTitle: {
        fontSize: "18px",
        color: "#333",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    dot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        display: "inline-block"
    },
    unreadBadge: {
        backgroundColor: "#d9534f",
        color: "white",
        fontSize: "12px",
        padding: "2px 8px",
        borderRadius: "12px",
        fontWeight: "bold"
    },
    subLabel: {
        fontSize: "13px",
        color: "#888",
        fontWeight: "bold",
        marginBottom: "8px",
        marginTop: "12px"
    },
    tableWrapper: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        overflow: "hidden",
        marginBottom: "16px"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse"
    },
    tableHeader: {},
    th: {
        padding: "14px 16px",
        textAlign: "left",
        color: "white",
        fontSize: "14px",
        fontWeight: "bold"
    },
    tableRow: {
        borderBottom: "1px solid #eee"
    },
    td: {
        padding: "12px 16px",
        fontSize: "14px",
        color: "#333"
    },
    btnGroup: {
        display: "flex",
        gap: "8px"
    },
    openBtn: {
        padding: "6px 14px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer"
    },
    readBtn: {
        padding: "6px 14px",
        backgroundColor: "white",
        color: "#1e3c72",
        border: "1px solid #1e3c72",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer"
    },
    emptyBox: {
        padding: "24px",
        backgroundColor: "white",
        borderRadius: "12px",
        textAlign: "center",
        color: "#888",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    }
};

export default AlertsPage;