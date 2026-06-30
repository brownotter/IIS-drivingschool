import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import CandidateTheoryClassDetails from "./CandidateTheoryClassDetails";

function CandidateTheorySchedule() {
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user")) || { id: 1 };
    const candidateId = user.id;

    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
    ];

    const dayMap = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday"
    };

    const formatSlotDisplay = (timeStr) => {
        if (!timeStr) return "";

        const parts = timeStr.split(":");
        const hour = parseInt(parts[0], 10);
        const minute = parts[1] || "00";

        return `${String(hour).padStart(2, "0")}:${minute}`;
    };

    const loadSchedule = () => {
        setLoading(true);
        setErrorMessage("");

        fetch(`http://localhost:8080/api/theory-classes/candidate/${candidateId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load schedule.");
                }

                return res.json();
            })
            .then((data) => {
                const classList = Array.isArray(data) ? data : [];
                setSchedule(classList);

                const rawTimes = classList
                    .map((c) =>
                        c.theoryStartTime
                            ? c.theoryStartTime.substring(0, 5)
                            : null
                    )
                    .filter(Boolean);

                const uniqueTimes = [...new Set(rawTimes)];
                uniqueTimes.sort((a, b) => a.localeCompare(b));

                if (uniqueTimes.length === 0) {
                    setTimeSlots(["09:00", "10:00", "11:00"]);
                } else {
                    setTimeSlots(uniqueTimes);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading schedule:", err);
                setErrorMessage("Schedule could not be loaded.");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadSchedule();
    }, [candidateId]);

    const getCellClass = (dayName, timeSlot) => {
        return schedule.find((c) => {
            const dateObj = new Date(c.theoryDate);
            const classDay = dayMap[dateObj.getDay()];
            const classStart = c.theoryStartTime
                ? c.theoryStartTime.substring(0, 5)
                : "";

            return classDay === dayName && classStart === timeSlot;
        });
    };

    const handleClassClick = (theoryClass) => {
        setSelectedClass(theoryClass);
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "My Profile", onClick: () => navigate("/candidate") },
                    { label: "Financials", onClick: () => navigate("/candidate/financials") },
                    { label: "Schedule", onClick: () => navigate("/candidate/theory-schedule") },
                    { label: "Notifications", onClick: () => navigate("/candidate/notifications") },
                    { label: "Theory simulation", onClick: () => navigate("/candidate/theory-simulation") },
                    { label: "Theory exam", onClick: () => navigate("/candidate/theory-exam") },
                    { label: "Reports", onClick: () => navigate("/candidate/reports") },
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <div style={styles.mainCard}>
                    <h1 style={styles.mainTitle}>Your Theory Schedule</h1>

                    {loading && (
                        <div style={styles.infoCard}>
                            Loading schedule...
                        </div>
                    )}

                    {!loading && errorMessage && (
                        <div style={styles.errorCard}>
                            {errorMessage}
                        </div>
                    )}

                    {!loading && !errorMessage && (
                        <>
                            <div style={styles.legendRow}>
                                <div style={styles.legendItem}>
                                    <span style={styles.enrolledDot}></span>
                                    Enrolled
                                </div>

                                <div style={styles.legendItem}>
                                    <span style={styles.availableDot}></span>
                                    Available
                                </div>
                            </div>

                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.timeHeaderCell}>Time</th>

                                            {daysOfWeek.map((day) => (
                                                <th key={day} style={styles.headerCell}>
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {timeSlots.map((slot) => (
                                            <tr key={slot} style={styles.tr}>
                                                <td style={styles.timeCell}>
                                                    {formatSlotDisplay(slot)}
                                                </td>

                                                {daysOfWeek.map((day) => {
                                                    const theoryClass =
                                                        getCellClass(day, slot);

                                                    return (
                                                        <td key={day} style={styles.gridCell}>
                                                            {theoryClass ? (
                                                                <div
                                                                    style={{
                                                                        ...styles.classCard,
                                                                        ...(theoryClass.status === "ENROLLED"
                                                                            ? styles.enrolledClassCard
                                                                            : styles.availableClassCard)
                                                                    }}
                                                                    onClick={() =>
                                                                        handleClassClick(theoryClass)
                                                                    }
                                                                >
                                                                    <span style={styles.cardTitle}>
                                                                        Theory Class
                                                                    </span>

                                                                    <span style={styles.cardStatus}>
                                                                        {theoryClass.status === "ENROLLED"
                                                                            ? "ENROLLED"
                                                                            : "AVAILABLE"}
                                                                    </span>

                                                                    {theoryClass.domainName && (
                                                                        <span style={styles.cardDomain}>
                                                                            {theoryClass.domainName}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span style={styles.emptySlot}></span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {selectedClass && (
                <CandidateTheoryClassDetails
                    theoryClass={selectedClass}
                    onClose={() => setSelectedClass(null)}
                    onRefreshSchedule={loadSchedule}
                />
            )}
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
        maxWidth: "1100px",
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

    infoCard: {
        backgroundColor: "#f4f7fb",
        padding: "25px",
        borderRadius: "12px",
        color: "#333",
        textAlign: "center",
        border: "1px solid #e6e6e6"
    },

    errorCard: {
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

    legendRow: {
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        marginBottom: "25px",
        color: "#333",
        fontSize: "14px",
        fontWeight: "bold"
    },

    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },

    enrolledDot: {
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        backgroundColor: "#394ea4",
        display: "inline-block"
    },

    availableDot: {
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        backgroundColor: "#93edcf",
        display: "inline-block"
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
        backgroundColor: "white",
        textAlign: "center",
        fontSize: "14px"
    },

    headerCell: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "14px 10px",
        fontWeight: "bold",
        minWidth: "120px",
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.5px"
    },

    timeHeaderCell: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "14px 10px",
        fontWeight: "bold",
        width: "100px",
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.5px"
    },

    tr: {
        borderBottom: "1px solid #e6e6e6"
    },

    timeCell: {
        padding: "18px 10px",
        fontSize: "15px",
        textAlign: "center",
        backgroundColor: "#f4f7fb",
        fontWeight: "bold",
        color: "#1e3c72",
        verticalAlign: "middle"
    },

    gridCell: {
        padding: "12px",
        width: "120px",
        height: "120px",
        verticalAlign: "middle",
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #f0f0f0"
    },

    classCard: {
        borderRadius: "12px",
        padding: "12px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        height: "100%",
        boxSizing: "border-box",
        boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
        transition: "0.2s"
    },

    enrolledClassCard: {
        backgroundColor: "#394ea4",
        color: "white"
    },

    availableClassCard: {
        backgroundColor: "#93edcf",
        color: "#1e3c72",
        border: "1px solid #d9e6f7"
    },

    cardTitle: {
        fontSize: "15px",
        fontWeight: "bold",
        marginBottom: "6px"
    },

    cardStatus: {
        fontSize: "11px",
        fontWeight: "bold",
        letterSpacing: "0.5px",
        marginBottom: "5px"
    },

    cardDomain: {
        fontSize: "11px",
        marginTop: "4px",
        textAlign: "center",
        opacity: 0.9
    },

    emptySlot: {
        color: "#c7c7c7",
        fontSize: "18px"
    }
};

export default CandidateTheorySchedule;