import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function ProfessorSchedule() {
    const [schedule, setSchedule] = useState([]);
    const [professor, setProfessor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState([]); 
    const [debugError, setDebugError] = useState("");
    const navigate = useNavigate();

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
    console.log("1. Pokreće se učitavanje profila...");
    fetch("http://localhost:8080/user/professor/profile", {
        method: "GET",
        credentials: "include"
    })
        .then((response) => {
            if (!response.ok) throw new Error("Profil backend returned error: " + response.status);
            return response.json();
        })
        .then((profData) => {
            console.log("2. Profil successfully loaded:", profData);
            setProfessor(profData);
            
            const actualId = profData.id || profData.professorId || profData.userId;
            
            if (!actualId) {
                throw new Error("Backend profil object does not have a recognizable ID! Received: " + JSON.stringify(profData));
            }

            console.log(`3. Sending request for professor's schedule with ID: ${actualId}...`);
            return fetch(`http://localhost:8080/api/theory-classes/professor/${actualId}/weekly-schedule`, {
                method: "GET",
                credentials: "include"
            });
        })
        .then((response) => {
            if (!response.ok) throw new Error("Raspored backend returned error: " + response.status);
            return response.json();
        })
        .then((scheduleData) => {
            console.log("4. Schedule data:", scheduleData);
            const safeData = Array.isArray(scheduleData) ? scheduleData : [];
            setSchedule(safeData);

            const startTimes = safeData
                .map(item => item.theoryStartTime)
                .filter((time, index, self) => time && self.indexOf(time) === index);

            startTimes.sort((a, b) => a.localeCompare(b));

            const formattedSlots = startTimes.map(time => {
                const parts = time.split(":");
                return `${parts[0]}:${parts[1]}`;
            });

            console.log("5. Formatted time slots:", formattedSlots);
            setTimeSlots(formattedSlots);
            setLoading(false);
        })
        .catch((error) => {
            console.error("CATCH BLOK - Caught error:", error);
            setDebugError(error.message || "Unknown error occurred while loading schedule.");
            setLoading(false);
        });
}, []);
 
    const getDayFromDate = (dateString) => {
        if (!dateString) return "";
        const parts = dateString.split("-");
        if (parts.length !== 3) return "";
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
    };

    const classMatchesSlot = (item, day, slot) => {
        if (!item || !item.theoryDate || !item.theoryStartTime) return false;
        const itemDay = getDayFromDate(item.theoryDate);
        if (itemDay !== day) return false;
        const itemTimeFormatted = item.theoryStartTime.substring(0, 5);
        return itemTimeFormatted === slot;
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (loading) {
        return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading schedule (Check console)...</h2>;
    }

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "My Profile", onClick: () => navigate("/professor/dashboard") },
                    { label: "Schedule", onClick: () => navigate("/professor/schedule") },
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <h1 style={styles.mainTitle}>Weekly Theory Schedule</h1>
                
                {debugError && (
                    <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                        <strong>Communication Error:</strong> {debugError} <br/>
                        <small>Open F12 console in browser for details.</small>
                    </div>
                )}

                <div style={styles.calendarWrapper}>
                    {timeSlots.length === 0 ? (
                        <div style={styles.noClasses}>
                            You have no scheduled classes or the server returned an empty array. <br/>
                            <small style={{ color: "#999" }}>Actual response from server: {JSON.stringify(schedule)}</small>
                        </div>
                    ) : (
                        <table style={styles.calendarTable}>
                            <thead>
                                <tr>
                                    <th style={styles.calendarThTime}>Start Time</th>
                                    {daysOfWeek.map(day => (
                                        <th key={day} style={styles.calendarTh}>{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot) => (
                                    <tr key={slot}>
                                        <td style={styles.timeTd}>{slot} h</td>
                                        {daysOfWeek.map((day) => {
                                            const foundClass = schedule.find(item => classMatchesSlot(item, day, slot));
                                            return (
                                                <td key={day} style={styles.calendarTd}>
                                                    {foundClass && (
                                                        <div 
                                                            style={styles.classCard}
                                                            onClick={() => navigate(`/professor/class-details/${foundClass.theoryId || foundClass.theoryClassId}`)}
                                                        >
                                                            <div style={styles.classTitle}>Your Class</div>
                                                            <div style={styles.classInfo}>
                                                                {foundClass.theoryStartTime?.substring(0, 5)} - {foundClass.theoryEndTime?.substring(0, 5)}
                                                            </div>
                                                            <div style={styles.classInfo}> see more </div>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", minHeight: "100vh" },
    content: { flex: 1, padding: "40px", backgroundColor: "#f4f6f9", fontFamily: "Arial, sans-serif" },
    mainTitle: { color: "#1e3c72", marginBottom: "20px", fontSize: "28px" },
    calendarWrapper: { backgroundColor: "white", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", overflowX: "auto", padding: "10px" },
    calendarTable: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
    calendarThTime: { backgroundColor: "#e0e0e0", color: "#333", padding: "15px", width: "110px", textAlign: "center", border: "1px solid #ccc", fontWeight: "bold" },
    calendarTh: { backgroundColor: "white", color: "#333", padding: "15px", textAlign: "center", border: "1px solid #ccc", fontSize: "16px" },
    timeTd: { backgroundColor: "#f9f9f9", fontWeight: "bold", color: "#1e3c72", textAlign: "center", padding: "20px 10px", border: "1px solid #eee", fontSize: "15px" },
    calendarTd: { border: "1px solid #eee", padding: "5px", verticalAlign: "top", height: "100px", backgroundColor: "#fdfdfd" },
    classCard: { backgroundColor: "#9cc2cb", color: "#222", borderRadius: "8px", padding: "10px", height: "calc(100% - 20px)", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid #7ba3ac" },
    classTitle: { fontWeight: "bold", fontSize: "14px", marginBottom: "4px", color: "#1e3c72" },
    classInfo: { fontSize: "13px", textAlign: "center", color: "#333" },
    noClasses: { padding: "40px", textAlign: "center", color: "#666", fontSize: "18px", fontWeight: "500" }
};

export default ProfessorSchedule;