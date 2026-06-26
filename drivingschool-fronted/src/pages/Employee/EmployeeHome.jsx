import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getActiveAlerts } from "../../services/employeeService";

function EmployeeHome() {
    const navigate = useNavigate();
    const [expiring, setExpiring] = useState([]);
    const [expired, setExpired] = useState([]);
    const [hoveredAlert, setHoveredAlert] = useState(null);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            const { expiring, expired } = await getActiveAlerts();
            setExpiring(expiring);
            setExpired(expired);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownloadReport = async () => {
    try {
        const response = await fetch(
            "http://localhost:8080/documents/report/all",
            { credentials: "include" }
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report_all_candidates.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
    }
    };

    const formatDate = (date) => {
    if (!date) return "-";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
    };

    const logout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            method: "GET",
            credentials: "include"
        });
        localStorage.clear();
        navigate("/");
    };

    const allAlerts = [
        ...expired.map(d => ({ ...d, alertType: "EXPIRED" })),
        ...expiring.map(d => ({ ...d, alertType: "EXPIRING_SOON" }))
    ];

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

                <div style={styles.center}>
                    <h1 style={styles.schoolName}>Autoškola ĐIR</h1>

                    <div style={styles.buttonsRow}>

                        <button
                            style={styles.addBtn}
                            onClick={() => navigate("/employee/documents/new")}
                        >
                             Add new <br></br> document
                        </button>

                        <button
                            style={styles.addBtn}
                            onClick={handleDownloadReport}
                        >
                             Generate a completeness <br></br> report document
                        </button>

                    </div>

                    <div style={styles.alertsCard}>
                    <div style={styles.alertsHeader}>
                        <h2 style={styles.alertsTitle}>
                            Active alerts
                        </h2>
                        <button
                            style={styles.viewAllBtn}
                            onClick={() => navigate("/employee/alerts")}
                        >
                            View all
                        </button>
                    </div>

                    {allAlerts.length === 0 ? (
                        <p style={styles.noAlerts}>No active alerts.</p>
                    ) : (
                        <div style={{... styles.alertsList, maxHeight: "280px", overflowY: "auto", overflowX: "hidden"}}>
                            {allAlerts.map((doc) => (
                                <div
                                    key={doc.documentsId}
                                    style={{
                                        ...styles.alertItem,
                                        backgroundColor: hoveredAlert === doc.documentsId ? "#f0f4ff" : "#fafafa",
                                        borderColor: hoveredAlert === doc.documentsId ? "#1e3c72" : "#eee",
                                    }}
                                    onClick={() => navigate(`/employee/documents/${doc.documentsId}`)}
                                    onMouseEnter={() => setHoveredAlert(doc.documentsId)}
                                    onMouseLeave={() => setHoveredAlert(null)}
                                >
                                    <div style={styles.alertLeft}>
                                        <span style={styles.alertName}>
                                            {doc.candidateName} — {doc.docsTitle}
                                        </span>
                                        <span style={styles.alertDate}>
                                            {doc.docsExpireDate
                                                ? `Expires ${formatDate(doc.docsExpireDate)}`
                                                : "No expiry date"
                                            }
                                        </span>
                                    </div>
                                    <span style={{
                                        ...styles.alertBadge,
                                        color: doc.alertType === "EXPIRED" ? "#721c24" : "#856404",
                                        backgroundColor: doc.alertType === "EXPIRED" ? "#f8d7da" : "#fff3cd"
                                    }}>
                                        {doc.alertType === "EXPIRED"
                                            ? "EXPIRED"
                                            : `${doc.daysUntilExpiry} DAYS`
                                        }
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
    },

    center: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
    },

    schoolName: {
        color: "#1e3c72",
        fontSize: "36px",
        fontWeight: "bold",
        letterSpacing: "4px",
        marginBottom: "40px",
        alignSelf: "center"
    },

    subtitle: {
        color: "#888",
        fontSize: "15px",
        marginBottom: "40px"
    },

    buttonsRow: {
    display: "flex",
    gap: "16px"
    },

    addBtn: {
        padding: "12px 24px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    alertsCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        padding: "24px",
        width: "100%",
        maxWidth: "600px",
        marginTop: "30px"
    },

    alertsHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
    },

    alertsTitle: {
        fontSize: "16px",
        color: "#1e3c72",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },

    alertsBadge: {
        backgroundColor: "#d9534f",
        color: "white",
        fontSize: "12px",
        padding: "2px 8px",
        borderRadius: "12px",
        fontWeight: "bold"
    },

    viewAllBtn: {
        padding: "6px 14px",
        backgroundColor: "white",
        color: "#1e3c72",
        border: "1px solid #1e3c72",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer"
    },

    noAlerts: {
        color: "#888",
        fontSize: "14px",
        textAlign: "center",
        padding: "20px 0"
    },

    alertsList: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    alertItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #eee",
        cursor: "pointer",
        backgroundColor: "#fafafa"
    },

    alertLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    alertName: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#333"
    },

    alertDate: {
        fontSize: "12px",
        color: "#888"
    },

    alertBadge: {
        fontSize: "13px",
        fontWeight: "bold",
        padding: "4px 10px",
        borderRadius: "20px"
    }
};

export default EmployeeHome;