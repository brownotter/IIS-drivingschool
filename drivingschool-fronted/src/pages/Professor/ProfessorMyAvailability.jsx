import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function ProfessorMyAvailability() {
    const navigate = useNavigate();
    const [professor, setProfessor] = useState(null);
    
    const [weekSelection, setWeekSelection] = useState("next"); 
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [startTime, setStartTime] = useState("17:30"); 
    const [endTime, setEndTime] = useState("17:45");
    
    const [nextWeekDates, setNextWeekDates] = useState([]);
    const [message, setMessage] = useState({ text: "", isError: false });
    const [loading, setLoading] = useState(true);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const generateTimeOptions = () => {
        const times = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hh = h.toString().padStart(2, "0");
                const mm = m.toString().padStart(2, "0");
                times.push(`${hh}:${mm}`);
            }
        }
        return times;
    };
    const timeOptions = generateTimeOptions();

    useEffect(() => {
        fetch("http://localhost:8080/user/professor/profile", {
            method: "GET",
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error("Profil not found or session expired.");
            return res.json();
        })
        .then(profData => {
            setProfessor(profData);
            return fetch("http://localhost:8080/api/professor-availabilities/next-week", {
                method: "GET",
                credentials: "include"
            });
        })
        .then(res => {
            if (!res.ok) throw new Error("Backend did not return dates for the next week.");
            return res.json();
        })
        .then(dates => {
            setNextWeekDates(Array.isArray(dates) ? dates : []);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error loading initial data:", err);
            setMessage({ text: err.message, isError: true });
            setLoading(false);
        });
    }, []);

    const calculateTargetDate = () => {
        if (!nextWeekDates || nextWeekDates.length === 0) return null;

        const dayIndex = daysOfWeek.indexOf(selectedDay);
        if (dayIndex === -1 || !nextWeekDates[dayIndex]) return null;

        if (weekSelection === "next") {
            return nextWeekDates[dayIndex];
        } else {
            try {
                const baseDate = new Date(nextWeekDates[dayIndex]);
                if (isNaN(baseDate.getTime())) return null;
                
                baseDate.setDate(baseDate.getDate() + 7);
                
                const yyyy = baseDate.getFullYear();
                const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
                const dd = String(baseDate.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
            } catch (e) {
                return null;
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ text: "", isError: false });

        const targetDate = calculateTargetDate();
        const professorId = professor?.id; 

        if (!professorId) {
            setMessage({ text: "Error: Professor ID is missing. Please check your profile.", isError: true });
            return;
        }
        if (!targetDate) {
            setMessage({ text: "Error: System cannot calculate date for this day.", isError: true });
            return;
        }
        if (startTime >= endTime) {
            setMessage({ text: "Error: Start time must be before end time.", isError: true });
            return;
        }

        const availabilityDto = {
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
            availableDate: targetDate,
            professorId: professorId
        };

        fetch("http://localhost:8080/api/professor-availabilities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(availabilityDto),
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text || "Server is not responding.") });
            }
            return res.json();
        })
        .then(() => {
            setMessage({ text: `Successfully saved: ${selectedDay} (${targetDate}) in the period ${startTime} - ${endTime}`, isError: false });
        })
        .catch(err => {
                setMessage({ text: "You already have availability set for this period!"});
        });
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (loading) {
        return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading availability settings...</h2>;
    }

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "My Profile", onClick: () => navigate("/professor/dashboard") },
                    { label: "Schedule", onClick: () => navigate("/professor/schedule") },
                    { label: "My Availability", onClick: () => navigate("/professor/availability") },
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <div style={styles.wireframeBox}>
                    <h1 style={styles.mainTitle}>My Availability</h1>

                    <div style={styles.weekToggleContainer}>
                        <button 
                            type="button"
                            style={{...styles.weekBtn, ...(weekSelection === "next" ? styles.activeWeekBtn : {})}}
                            onClick={() => setWeekSelection("next")}
                        >
                            Next Week
                        </button>
                        <button 
                            type="button"
                            style={{...styles.weekBtn, ...(weekSelection === "after" ? styles.activeWeekBtn : {})}}
                            onClick={() => setWeekSelection("after")}
                        >
                            Week After
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>Select day of the week:</label>
                            <select 
                                value={selectedDay} 
                                onChange={(e) => setSelectedDay(e.target.value)}
                                style={styles.dayDropdown}
                            >
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.timeSectionRow}>
                            <div style={styles.timeColumn}>
                                <label style={styles.fieldLabel}>Available From Time:</label>
                                <select 
                                    size={4} 
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    style={styles.scrollTimeList}
                                >
                                    {timeOptions.map(t => (
                                        <option key={t} value={t}>{t} h</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.timeColumn}>
                                <label style={styles.fieldLabel}>Available To Time:</label>
                                <select 
                                    size={4}
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    style={styles.scrollTimeList}
                                >
                                    {timeOptions.map(t => (
                                        <option key={t} value={t}>{t} h</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {message.text && (
                            <div style={{
                                ...styles.statusMessage,
                                backgroundColor: message.isError ? "#f8d7da" : "#d4edda",
                                color: message.isError ? "#721c24" : "#155724",
                                border: message.isError ? "1px solid #f5c6cb" : "1px solid #c3e6cb"
                            }}>
                                {message.text}
                            </div>
                        )}

                        <button type="submit" style={styles.submitButton}>
                            Submit Availability
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", minHeight: "100vh" },
    content: { flex: 1, padding: "40px", backgroundColor: "#ffffff", fontFamily: '"Arial", sans-serif', display: "flex", justifyContent: "center", alignItems: "center" },
    wireframeBox: { border: "2px solid #333333", padding: "40px 60px", width: "100%", maxWidth: "700px", minHeight: "550px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff", boxSizing: "border-box" },
    mainTitle: { fontSize: "36px", fontWeight: "normal", textDecoration: "underline", color: "#222", marginBottom: "30px", marginTop: "0" },
    weekToggleContainer: { display: "flex", border: "2px solid #333333", borderRadius: "6px", marginBottom: "35px", overflow: "hidden", width: "260px" },
    weekBtn: { flex: 1, padding: "10px 15px", border: "none", backgroundColor: "#ffffff", cursor: "pointer", fontSize: "14px", fontWeight: "bold", fontFamily: "inherit" },
    activeWeekBtn: { backgroundColor: "#9cc2cb", color: "#000000" },
    form: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "25px" },
    fieldGroup: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "8px" },
    fieldLabel: { fontSize: "20px", color: "#222", marginBottom: "4px" },
    dayDropdown: { width: "220px", padding: "6px 12px", border: "2px solid #333333", borderRadius: "6px", fontSize: "16px", fontFamily: "inherit", textAlign: "center" },
    timeSectionRow: { display: "flex", justifyContent: "space-between", width: "85%", gap: "40px", marginTop: "10px" },
    timeColumn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
    scrollTimeList: { width: "160px", border: "2px solid #333333", borderRadius: "0px", fontSize: "14px", fontFamily: "inherit", textAlign: "center", padding: "2px", height: "95px", outline: "none" },
    submitButton: { width: "85%", padding: "12px", backgroundColor: "#ffffff", border: "2px solid #333333", borderRadius: "8px", fontSize: "22px", cursor: "pointer", fontFamily: "inherit", marginTop: "20px" },
    statusMessage: { width: "85%", padding: "10px", borderRadius: "6px", textAlign: "center", fontSize: "14px", fontWeight: "bold" }
};

export default ProfessorMyAvailability;