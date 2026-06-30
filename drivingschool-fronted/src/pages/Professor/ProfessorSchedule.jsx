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

    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
    ];

    useEffect(() => {
        fetch("http://localhost:8080/user/professor/profile", {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Profile could not be loaded.");
                }

                return response.json();
            })
            .then((profData) => {
                setProfessor(profData);

                const actualId =
                    profData.id || profData.professorId || profData.userId;

                if (!actualId) {
                    throw new Error("Professor ID was not found.");
                }

                return fetch(
                    `http://localhost:8080/api/theory-classes/professor/${actualId}/weekly-schedule`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Schedule could not be loaded.");
                }

                return response.json();
            })
            .then((scheduleData) => {
                const safeData = Array.isArray(scheduleData)
                    ? scheduleData
                    : [];

                setSchedule(safeData);

                const startTimes = safeData
                    .map((item) => item.theoryStartTime)
                    .filter(
                        (time, index, self) =>
                            time && self.indexOf(time) === index
                    );

                startTimes.sort((a, b) => a.localeCompare(b));

                const formattedSlots = startTimes.map((time) => {
                    const parts = time.split(":");
                    return `${parts[0]}:${parts[1]}`;
                });

                setTimeSlots(formattedSlots);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading professor schedule:", error);
                setDebugError(
                    error.message || "Unknown error occurred while loading schedule."
                );
                setLoading(false);
            });
    }, []);

    const getDayFromDate = (dateString) => {
        if (!dateString) {
            return "";
        }

        const parts = dateString.split("-");

        if (parts.length !== 3) {
            return "";
        }

        const date = new Date(parts[0], parts[1] - 1, parts[2]);

        return new Intl.DateTimeFormat("en-US", {
            weekday: "long"
        }).format(date);
    };

    const classMatchesSlot = (item, day, slot) => {
        if (!item || !item.theoryDate || !item.theoryStartTime) {
            return false;
        }

        const itemDay = getDayFromDate(item.theoryDate);

        if (itemDay !== day) {
            return false;
        }

        const itemTimeFormatted = item.theoryStartTime.substring(0, 5);

        return itemTimeFormatted === slot;
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
                    <div style={styles.mainCard}>
                        <h1 style={styles.mainTitle}>Weekly Theory Schedule</h1>

                        <div style={styles.infoCard}>
                            Loading schedule...
                        </div>
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
                    <h1 style={styles.mainTitle}>Weekly Theory Schedule</h1>

                    {professor && (
                        <div style={styles.professorInfoCard}>
                            <b>Professor:</b>{" "}
                            {professor.firstName} {professor.lastName}
                        </div>
                    )}

                    {debugError && (
                        <div style={styles.errorCard}>
                            {debugError}
                        </div>
                    )}

                    <div style={styles.calendarWrapper}>
                        {timeSlots.length === 0 ? (
                            <div style={styles.noClasses}>
                                You have no scheduled theory classes for this week.
                            </div>
                        ) : (
                            <table style={styles.calendarTable}>
                                <thead>
                                    <tr>
                                        <th style={styles.calendarThTime}>
                                            Start Time
                                        </th>

                                        {daysOfWeek.map((day) => (
                                            <th key={day} style={styles.calendarTh}>
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {timeSlots.map((slot) => (
                                        <tr key={slot} style={styles.tr}>
                                            <td style={styles.timeTd}>
                                                {slot} h
                                            </td>

                                            {daysOfWeek.map((day) => {
                                                const foundClass = schedule.find((item) =>
                                                    classMatchesSlot(item, day, slot)
                                                );

                                                return (
                                                    <td
                                                        key={day}
                                                        style={styles.calendarTd}
                                                    >
                                                        {foundClass && (
                                                            <div
                                                                style={styles.classCard}
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/professor/class-details/${
                                                                            foundClass.theoryId ||
                                                                            foundClass.theoryClassId
                                                                        }`
                                                                    )
                                                                }
                                                            >
                                                                <div style={styles.classTitle}>
                                                                    Theory Class
                                                                </div>

                                                                <div style={styles.classInfo}>
                                                                    {foundClass.theoryStartTime?.substring(
                                                                        0,
                                                                        5
                                                                    )}{" "}
                                                                    -{" "}
                                                                    {foundClass.theoryEndTime?.substring(
                                                                        0,
                                                                        5
                                                                    )}
                                                                </div>

                                                                {foundClass.domainName && (
                                                                    <div style={styles.classDomain}>
                                                                        {foundClass.domainName}
                                                                    </div>
                                                                )}

                                                                <div style={styles.seeMore}>
                                                                    View details
                                                                </div>
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
        marginBottom: "25px",
        fontSize: "32px"
    },

    professorInfoCard: {
        backgroundColor: "#f4f7fb",
        color: "#333",
        border: "1px solid #e6e6e6",
        borderRadius: "10px",
        padding: "14px",
        textAlign: "center",
        marginBottom: "25px"
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

    calendarWrapper: {
        width: "100%",
        overflowX: "auto",
        borderRadius: "12px",
        border: "1px solid #e6e6e6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    },

    calendarTable: {
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        backgroundColor: "white",
        textAlign: "center",
        fontSize: "14px"
    },

    calendarThTime: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "14px 10px",
        width: "110px",
        textAlign: "center",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.5px"
    },

    calendarTh: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "14px 10px",
        textAlign: "center",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.5px"
    },

    tr: {
        borderBottom: "1px solid #e6e6e6"
    },

    timeTd: {
        backgroundColor: "#f4f7fb",
        fontWeight: "bold",
        color: "#1e3c72",
        textAlign: "center",
        padding: "18px 10px",
        fontSize: "15px",
        verticalAlign: "middle"
    },

    calendarTd: {
        borderLeft: "1px solid #f0f0f0",
        padding: "10px",
        verticalAlign: "middle",
        height: "120px",
        backgroundColor: "#ffffff"
    },

    classCard: {
        backgroundColor: "#eaf1fb",
        color: "#1e3c72",
        borderRadius: "12px",
        padding: "12px 8px",
        minHeight: "90px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #d9e6f7",
        boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
        boxSizing: "border-box"
    },

    classTitle: {
        fontWeight: "bold",
        fontSize: "15px",
        marginBottom: "5px"
    },

    classInfo: {
        fontSize: "13px",
        textAlign: "center",
        color: "#333",
        marginBottom: "4px"
    },

    classDomain: {
        fontSize: "12px",
        textAlign: "center",
        color: "#555",
        marginBottom: "5px"
    },

    seeMore: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#1e3c72",
        marginTop: "4px"
    },

    noClasses: {
        padding: "40px",
        textAlign: "center",
        color: "gray",
        fontSize: "16px"
    }
};

export default ProfessorSchedule;