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

    const user = JSON.parse(localStorage.getItem("user")) || { id: 1 }; 
    const candidateId = user.id;

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const dayMap = {
        1: "Monday", 2: "Tuesday", 3: "Wednesday", 
        4: "Thursday", 5: "Friday", 6: "Saturday", 0: "Sunday"
    };

    const formatSlotDisplay = (timeStr) => {
        if (!timeStr) return "";
        const parts = timeStr.split(":");
        const hour = parseInt(parts[0], 10);
        const minute = parts[1] || "00";
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const loadSchedule = () => {
        setLoading(true);
        fetch(`http://localhost:8080/api/theory-classes/candidate/${candidateId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Raspored uspešno učitan:", data);
                const classList = Array.isArray(data) ? data : [];
                setSchedule(classList);

                const rawTimes = classList.map(c => {
                    return c.theoryStartTime ? c.theoryStartTime.substring(0, 5) : null;
                }).filter(Boolean);

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
            const classStart = c.theoryStartTime ? c.theoryStartTime.substring(0, 5) : "";
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
                <div style={styles.wireframeBox}>
                    <h1 style={styles.mainTitle}>Your theory schedule</h1>

                    {loading ? (
                        <div style={styles.loadingText}>Loading schedule...</div>
                    ) : (
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.timeHeaderCell}>Time</th>
                                        {daysOfWeek.map((day) => (
                                            <th key={day} style={styles.headerCell}>{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((slot) => (
                                        <tr key={slot}>
                                            <td style={styles.timeCell}>
                                                {formatSlotDisplay(slot)}
                                            </td>
                                            
                                            {daysOfWeek.map((day) => {
                                                const theoryClass = getCellClass(day, slot);
                                                return (
                                                    <td key={day} style={styles.gridCell}>
                                                        {theoryClass && (
                                                            <div 
                                                                style={{
                                                                    ...styles.classCard,
                                                                    backgroundColor: theoryClass.status === "ENROLLED" ? "#9cc2cb" : "#c4dbdf"
                                                                }}
                                                                onClick={() => handleClassClick(theoryClass)}
                                                            >
                                                                <span style={styles.cardTitle}>Theory</span>
                                                                <span style={styles.cardSubtitle}>class</span>
                                                                <span style={styles.cardStatus}>
                                                                    {theoryClass.status === "ENROLLED" ? "ENROLLED" : "AVAILABLE"}
                                                                </span>
                                                                {theoryClass.domainName && (
                                                                    <span style={styles.cardDomain}>{theoryClass.domainName}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
    container: { display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" },
    content: { flex: 1, padding: "30px", backgroundColor: "#ffffff", fontFamily: '"Arial", sans-serif', display: "flex", justifyContent: "center" },
    wireframeBox: { border: "2px solid #333333", padding: "40px", width: "100%", maxWidth: "1000px", display: "flex", flexDirection: "column", backgroundColor: "#ffffff", boxSizing: "border-box" },
    mainTitle: { fontSize: "36px", fontWeight: "normal", color: "#222", marginBottom: "35px", marginTop: "0", textAlign: "center", textDecoration: "underline" },
    loadingText: { textAlign: "center", padding: "40px", fontSize: "18px", color: "#666" },
    tableWrapper: { width: "100%", overflowX: "auto", border: "2px solid #333333" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#ffffff" },
    headerCell: { border: "1px solid #333333", padding: "12px 8px", fontSize: "16px", fontWeight: "normal", textAlign: "center", minWidth: "110px" },
    timeHeaderCell: { border: "1px solid #333333", padding: "12px 8px", fontSize: "16px", fontWeight: "normal", textAlign: "center", backgroundColor: "#eaeaea", width: "100px" },
    timeCell: { border: "1px solid #333333", padding: "20px 10px", fontSize: "16px", textAlign: "center", backgroundColor: "#eaeaea", fontWeight: "500", verticalAlign: "middle" },
    gridCell: { border: "1px solid #333333", padding: "10px", width: "120px", height: "130px", verticalAlign: "top", backgroundColor: "#fdffdf" },
    classCard: {
        border: "2px solid #333333",
        borderRadius: "12px",
        padding: "12px 6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        boxShadow: "2px 2px 0px #333333",
        height: "100%",
        boxSizing: "border-box"
    },
    cardTitle: { fontSize: "16px", fontWeight: "bold", color: "#222" },
    cardSubtitle: { fontSize: "13px", color: "#333", marginBottom: "4px" },
    cardStatus: { fontSize: "11px", fontWeight: "bold", letterSpacing: "0.5px", textDecoration: "underline", color: "#000" },
    cardDomain: { fontSize: "10px", color: "#555", marginTop: "4px", fontStyle: "italic", textAlign: "center" }
};

export default CandidateTheorySchedule;