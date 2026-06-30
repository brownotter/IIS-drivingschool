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

    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

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
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Profile not found or session expired.");
                }

                return res.json();
            })
            .then((profData) => {
                setProfessor(profData);

                return fetch(
                    "http://localhost:8080/api/professor-availabilities/next-week",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        "Backend did not return dates for the next week."
                    );
                }

                return res.json();
            })
            .then((dates) => {
                setNextWeekDates(Array.isArray(dates) ? dates : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading initial data:", err);
                setMessage({ text: err.message, isError: true });
                setLoading(false);
            });
    }, []);

    const calculateTargetDate = () => {
        if (!nextWeekDates || nextWeekDates.length === 0) {
            return null;
        }

        const dayIndex = daysOfWeek.indexOf(selectedDay);

        if (dayIndex === -1 || !nextWeekDates[dayIndex]) {
            return null;
        }

        if (weekSelection === "next") {
            return nextWeekDates[dayIndex];
        }

        try {
            const baseDate = new Date(nextWeekDates[dayIndex]);

            if (isNaN(baseDate.getTime())) {
                return null;
            }

            baseDate.setDate(baseDate.getDate() + 7);

            const yyyy = baseDate.getFullYear();
            const mm = String(baseDate.getMonth() + 1).padStart(2, "0");
            const dd = String(baseDate.getDate()).padStart(2, "0");

            return `${yyyy}-${mm}-${dd}`;
        } catch (e) {
            return null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setMessage({ text: "", isError: false });

        const targetDate = calculateTargetDate();
        const professorId = professor?.id;

        if (!professorId) {
            setMessage({
                text: "Error: Professor ID is missing. Please check your profile.",
                isError: true
            });
            return;
        }

        if (!targetDate) {
            setMessage({
                text: "Error: System cannot calculate date for this day.",
                isError: true
            });
            return;
        }

        if (startTime >= endTime) {
            setMessage({
                text: "Error: Start time must be before end time.",
                isError: true
            });
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
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw new Error(text || "Server is not responding.");
                    });
                }

                return res.json();
            })
            .then(() => {
                setMessage({
                    text: `Successfully saved: ${selectedDay} (${targetDate}) in the period ${startTime} - ${endTime}`,
                    isError: false
                });
            })
            .catch(() => {
                setMessage({
                    text: "You already have availability set for this period!",
                    isError: true
                });
            });
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Sidebar
                    buttons={[
                        {
                            label: "My Profile",
                            onClick: () => navigate("/professor/dashboard")
                        },
                        {
                            label: "Schedule",
                            onClick: () => navigate("/professor/schedule")
                        },
                        {
                            label: "My Availability",
                            onClick: () => navigate("/professor/availability")
                        },
                        {
                            label: "Notifications",
                            onClick: () => navigate("/professor/notifications")
                        }
                    ]}
                    logout={logout}
                />

                <div style={styles.content}>
                    <div style={styles.card}>
                        <p style={styles.cardText}>
                            Loading availability settings...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    {
                        label: "My Profile",
                        onClick: () => navigate("/professor/dashboard")
                    },
                    {
                        label: "Schedule",
                        onClick: () => navigate("/professor/schedule")
                    },
                    {
                        label: "My Availability",
                        onClick: () => navigate("/professor/availability")
                    },
                    {
                        label: "Notifications",
                        onClick: () => navigate("/professor/notifications")
                    }
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <div style={styles.mainCard}>
                    <h1 style={styles.mainTitle}>My Availability</h1>

                    <div style={styles.weekToggleContainer}>
                        <button
                            type="button"
                            style={{
                                ...styles.weekBtn,
                                ...(weekSelection === "next"
                                    ? styles.activeWeekBtn
                                    : {})
                            }}
                            onClick={() => setWeekSelection("next")}
                        >
                            Next Week
                        </button>

                        <button
                            type="button"
                            style={{
                                ...styles.weekBtn,
                                ...(weekSelection === "after"
                                    ? styles.activeWeekBtn
                                    : {})
                            }}
                            onClick={() => setWeekSelection("after")}
                        >
                            Week After
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>
                                Select day of the week
                            </label>

                            <select
                                value={selectedDay}
                                onChange={(e) =>
                                    setSelectedDay(e.target.value)
                                }
                                style={styles.dayDropdown}
                            >
                                {daysOfWeek.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.timeSectionRow}>
                            <div style={styles.timeColumn}>
                                <label style={styles.fieldLabel}>
                                    Available From
                                </label>

                                <select
                                    size={6}
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    style={styles.scrollTimeList}
                                >
                                    {timeOptions.map((time) => (
                                        <option key={time} value={time}>
                                            {time} h
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.timeColumn}>
                                <label style={styles.fieldLabel}>
                                    Available To
                                </label>

                                <select
                                    size={6}
                                    value={endTime}
                                    onChange={(e) =>
                                        setEndTime(e.target.value)
                                    }
                                    style={styles.scrollTimeList}
                                >
                                    {timeOptions.map((time) => (
                                        <option key={time} value={time}>
                                            {time} h
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {message.text && (
                            <div
                                style={{
                                    ...styles.statusMessage,
                                    backgroundColor: message.isError
                                        ? "#ffecec"
                                        : "#ecfff0",
                                    color: message.isError
                                        ? "#b00020"
                                        : "#2e7d32",
                                    border: message.isError
                                        ? "1px solid #d9534f"
                                        : "1px solid #5cb85c"
                                }}
                            >
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
        justifyContent: "center",
        alignItems: "flex-start"
    },

    mainCard: {
        width: "100%",
        maxWidth: "760px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        padding: "40px",
        boxSizing: "border-box"
    },

    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
    },

    cardText: {
        margin: 0,
        color: "#333",
        fontSize: "16px"
    },

    mainTitle: {
        textAlign: "center",
        color: "#1e3c72",
        marginTop: 0,
        marginBottom: "35px"
    },

    weekToggleContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginBottom: "35px"
    },

    weekBtn: {
        padding: "10px 22px",
        backgroundColor: "#ffffff",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px"
    },

    activeWeekBtn: {
        backgroundColor: "#1e3c72",
        color: "white",
        border: "1px solid #1e3c72"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "25px"
    },

    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    fieldLabel: {
        fontWeight: "bold",
        color: "#333"
    },

    dayDropdown: {
        padding: "10px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        fontSize: "15px"
    },

    timeSectionRow: {
        display: "flex",
        gap: "30px",
        justifyContent: "space-between"
    },

    timeColumn: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    scrollTimeList: {
        height: "140px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        padding: "5px",
        fontSize: "14px",
        outline: "none"
    },

    submitButton: {
        marginTop: "15px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "14px",
        fontSize: "17px",
        cursor: "pointer"
    },

    statusMessage: {
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: "bold"
    }
};

export default ProfessorMyAvailability;