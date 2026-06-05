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

    const renderTable = (docs, color) => (
        <div style={styles.tableWrapper}>
            <table style={styles.table}>
                <thead>
                    <tr style={{ ...styles.tableHeader, backgroundColor: color }}>
                        <th style={styles.th}>Document name</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>Created</th>
                        <th style={styles.th}>Expiry date</th>
                        <th style={styles.th}></th>
                    </tr>
                </thead>
                <tbody>
                    {docs.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={styles.emptyMsg}>No documents.</td>
                        </tr>
                    ) : (
                        docs.map((doc, index) => (
                            <tr
                                key={doc.documentsId}
                                style={{
                                    ...styles.tableRow,
                                    backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9"
                                }}
                            >
                                <td style={styles.td}>{doc.docsTitle}</td>
                                <td style={styles.td}>{formatType(doc.documentType)}</td>
                                <td style={styles.td}>{doc.docsCreateDate}</td>
                                <td style={styles.td}>{doc.docsExpireDate || "-"}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.openBtn}
                                        onClick={() => navigate(`/employee/documents/${doc.documentsId}`)}
                                    >
                                        Open
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

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

                {/* EXPIRING SOON */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <span style={styles.warningDot}></span>
                        <h2 style={styles.sectionTitle}>
                            Expiring soon ({expiring.length})
                        </h2>
                    </div>
                    {renderTable(expiring, "#856404")}
                </div>

                {/* EXPIRED */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <span style={styles.dangerDot}></span>
                        <h2 style={styles.sectionTitle}>
                            Expired ({expired.length})
                        </h2>
                    </div>
                    {renderTable(expired, "#721c24")}
                </div>

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
        marginBottom: "40px"
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px"
    },
    sectionTitle: {
        fontSize: "18px",
        color: "#333"
    },
    warningDot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "#856404",
        display: "inline-block"
    },
    dangerDot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "#721c24",
        display: "inline-block"
    },
    tableWrapper: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        overflow: "hidden"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse"
    },
    tableHeader: {
        backgroundColor: "#1e3c72"
    },
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
    openBtn: {
        padding: "6px 14px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer"
    },
    emptyMsg: {
        textAlign: "center",
        padding: "40px",
        color: "#888",
        fontSize: "15px"
    }
};

export default AlertsPage;