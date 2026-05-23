import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function TheoryScheduleViewPage() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/theory-classes/admin-weekly-schedule")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error in loading schedule.");
                }
                return res.json();
            })
            .then((data) => {
                setSchedule(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Schedule could not be loaded. Please try again later.");
                setLoading(false);
            });
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const parts = dateStr.split("-");
            if (parts.length === 3) {
                return `${parts[2]}.${parts[1]}.${parts[0]}.`;
            }
            return dateStr;
        } catch {
            return dateStr;
        }
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const parts = timeStr.split(":");
        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
        }
        return timeStr;
    };

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "Candidates", onClick: () => navigate("/admin/candidates") },
                    { label: "Professors", onClick: () => navigate("/admin/professors") },
                    { label: "Instructors", onClick: () => navigate("/admin/instructors") },
                    { label: "Vehicles", onClick: () => navigate("/admin/vehicles") },
                    { label: "Theory Schedule", onClick: () => navigate("/admin/theory-schedule") },
                    { label: "Requests", onClick: () => navigate("/admin/requests") },
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <div style={styles.wireframeBox}>
                    <h1 style={styles.mainTitle}>Theory Class Schedule</h1>

                    <div style={styles.tabContainer}>
                        <button 
                            type="button"
                            style={styles.tabBtn}
                            onClick={() => navigate("/admin/theory-schedule")}
                        >
                            Auto Generate
                        </button>
                        <button 
                            type="button"
                            style={styles.tabBtn}
                            onClick={() => navigate("/admin/theory-schedule")}
                        >
                            Manual Create
                        </button>
                        <button 
                            type="button"
                            style={{...styles.tabBtn, ...styles.activeTabBtn}}
                            onClick={() => {}}
                        >
                            Schedule
                        </button>
                    </div>

                    {error && <div style={styles.errorMessage}>{error}</div>}

                    {/* Loader ili Tabela */}
                    {loading ? (
                        <div style={styles.infoMessage}>Loading schedule...</div>
                    ) : (
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Time Slot</th>
                                        <th style={styles.th}>Domain / Lesson</th>
                                        <th style={styles.th}>Professor</th>
                                        <th style={styles.th}>Enrolled / Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.map((item, index) => (
                                        <tr key={item.theoryClassId || index} style={styles.tr}>
                                            <td style={styles.td}>
                                                <strong>{formatDate(item.theoryDate)}</strong>
                                            </td>
                                            <td style={styles.td}>
                                                {formatTime(item.theoryStartTime)} - {formatTime(item.theoryEndTime)}
                                            </td>
                                            <td style={styles.td}>
                                                {item.domainOrderNumber ? `${item.domainOrderNumber}. ` : ""}
                                                {item.domainName || "—"}
                                            </td>
                                            <td style={styles.td}>
                                                {item.professorName}
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    fontWeight: "bold", 
                                                    color: (item.currentEnrolled >= item.capacity) ? "#d9534f" : "#222"
                                                }}>
                                                    {item.currentEnrolled ?? 0}
                                                </span> 
                                                <span style={{ color: "#777" }}> / {item.capacity ?? 20}</span>
                                            </td>
                                        </tr>
                                    ))}

                                    {schedule.length === 0 && !error && (
                                        <tr>
                                            <td colSpan="5" style={styles.noDataTd}>
                                                There are no scheduled theory classes for this week.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", minHeight: "100vh" },
    content: { flex: 1, padding: "30px", backgroundColor: "#ffffff", fontFamily: '"Arial", sans-serif', display: "flex", justifyContent: "center" },
    wireframeBox: { border: "2px solid #333333", padding: "30px 40px", width: "100%", maxWidth: "950px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff", boxSizing: "border-box" },
    mainTitle: { fontSize: "32px", fontWeight: "normal", color: "#222", marginBottom: "25px", marginTop: "0", textAlign: "center" },
    tabContainer: { display: "flex", border: "2px solid #333333", borderRadius: "6px", marginBottom: "35px", overflow: "hidden", width: "360px" },
    tabBtn: { flex: 1, padding: "10px", border: "none", backgroundColor: "#ffffff", cursor: "pointer", fontSize: "14px", fontWeight: "bold", fontFamily: "inherit", borderRight: "1px solid #333", textAlign: "center" },
    activeTabBtn: { backgroundColor: "#9cc2cb", color: "#000000" },
    errorMessage: { width: "100%", padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "6px", textAlign: "center", fontSize: "14px", fontWeight: "bold", marginBottom: "15px", border: "1px solid #721c24" },
    infoMessage: { fontSize: "16px", color: "#555", marginTop: "20px" },
    tableWrapper: { width: "100%", border: "2px solid #333333", borderRadius: "4px", overflow: "hidden", backgroundColor: "#ffffff" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" },
    th: { backgroundColor: "#9cc2cb", color: "#000000", padding: "12px 15px", fontWeight: "bold", borderBottom: "2px solid #333333", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px" },
    tr: { borderBottom: "1px solid #333333", transition: "background-color 0.2s" },
    td: { padding: "12px 15px", color: "#222", verticalAlign: "middle" },
    noDataTd: { padding: "30px", textAlign: "center", color: "#888", fontSize: "15px" }
};

export default TheoryScheduleViewPage;