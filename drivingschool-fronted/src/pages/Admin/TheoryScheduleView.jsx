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
        if (!dateStr) {
            return "";
        }

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
        if (!timeStr) {
            return "";
        }

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
                    { label: "My Profile", onClick: () => navigate("/admin/profile") },
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
                <div style={styles.mainCard}>
                    <h1 style={styles.mainTitle}>Theory Class Schedule</h1>

                    <div style={styles.tabContainer}>
                        <button
                            type="button"
                            style={styles.tabBtn}
                            onClick={() => navigate("/admin/theory-schedule")}
                        >
                            Create Schedule
                        </button>

                        <button
                            type="button"
                            style={{
                                ...styles.tabBtn,
                                ...styles.activeTabBtn
                            }}
                        >
                            View Schedule
                        </button>
                    </div>

                    {error && (
                        <div style={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={styles.infoCard}>
                            Loading schedule...
                        </div>
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
                                        <tr
                                            key={item.theoryClassId || index}
                                            style={styles.tr}
                                        >
                                            <td style={styles.td}>
                                                <strong>
                                                    {formatDate(item.theoryDate)}
                                                </strong>
                                            </td>

                                            <td style={styles.td}>
                                                {formatTime(item.theoryStartTime)} -{" "}
                                                {formatTime(item.theoryEndTime)}
                                            </td>

                                            <td style={styles.td}>
                                                {item.domainOrderNumber
                                                    ? `${item.domainOrderNumber}. `
                                                    : ""}
                                                {item.domainName || "—"}
                                            </td>

                                            <td style={styles.td}>
                                                {item.professorName || "—"}
                                            </td>

                                            <td style={styles.td}>
                                                <span
                                                    style={
                                                        item.currentEnrolled >= item.capacity
                                                            ? styles.fullCapacity
                                                            : styles.normalCapacity
                                                    }
                                                >
                                                    {item.currentEnrolled ?? 0}
                                                </span>

                                                <span style={styles.capacityTotal}>
                                                    {" "}
                                                    / {item.capacity ?? 20}
                                                </span>
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
    container: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        fontFamily: "Arial"
    },

    content: {
        flex: 1,
        padding: "40px",
        display: "flex",
        justifyContent: "center"
    },

    mainCard: {
        width: "100%",
        maxWidth: "1000px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        padding: "40px",
        boxSizing: "border-box"
    },

    mainTitle: {
        textAlign: "center",
        color: "#1e3c72",
        marginTop: 0,
        marginBottom: "30px",
        fontSize: "32px"
    },

    tabContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginBottom: "30px"
    },

    tabBtn: {
        padding: "10px 18px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        backgroundColor: "white",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold"
    },

    activeTabBtn: {
        backgroundColor: "#1e3c72",
        color: "white",
        border: "1px solid #1e3c72"
    },

    errorMessage: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#ffecec",
        color: "#b00020",
        borderRadius: "8px",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "20px",
        border: "1px solid #d9534f",
        boxSizing: "border-box"
    },

    infoCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        color: "#333",
        textAlign: "center"
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto",
        borderRadius: "12px",
        border: "1px solid #e6e6e6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
        fontSize: "14px",
        backgroundColor: "white"
    },

    th: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "14px 15px",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.5px"
    },

    tr: {
        borderBottom: "1px solid #e6e6e6"
    },

    td: {
        padding: "14px 15px",
        color: "#333",
        verticalAlign: "middle"
    },

    fullCapacity: {
        fontWeight: "bold",
        color: "#b00020"
    },

    normalCapacity: {
        fontWeight: "bold",
        color: "#1e3c72"
    },

    capacityTotal: {
        color: "#777"
    },

    noDataTd: {
        padding: "30px",
        textAlign: "center",
        color: "gray",
        fontSize: "15px"
    }
};

export default TheoryScheduleViewPage;