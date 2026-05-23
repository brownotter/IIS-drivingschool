import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function ProfessorClassDetails() {
    const { theoryId } = useParams();
    const navigate = useNavigate();
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [candidates, setCandidates] = useState([]);
    const [submitMessage, setSubmitMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/api/theory-classes/${theoryId}/professor-details`, {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Theory class details not found.");
                }
                return response.json();
            })
            .then((data) => {
                setClassDetails(data);
                if (data.candidates) {
                    setCandidates(
                        data.candidates.map(c => ({
                            ...c,
                            status: c.status === "ATTENDED" ? "PRESENT" : "ABSENT"
                        }))
                    );
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log("Error loading class details:", error);
                setLoading(false);
            });
    }, [theoryId]);

    const handleStatusToggle = (attendanceId) => {
        setCandidates(prevCandidates =>
            prevCandidates.map(c => {
                if (c.attendanceId === attendanceId) {
                    return {
                        ...c,
                        status: c.status === "PRESENT" ? "ABSENT" : "PRESENT"
                    };
                }
                return c;
            })
        );
    };

    const handleSubmitAttendance = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");

        const attendanceRecords = candidates.map(c => ({
            attendanceId: c.attendanceId,
            status: c.status === "PRESENT" ? "ATTENDED" : "MISSED"
        }));

        fetch(`http://localhost:8080/api/theory-classes/professor/${theoryId}/submit-attendance`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attendanceRecords)
        })
        .then(async (res) => {
            if (res.ok) {
                setSubmitMessage("Attendance successfully submitted!");
                
                const newPresentCount = candidates.filter(c => c.status === "PRESENT").length;
                setClassDetails(prev => ({ ...prev, presentCount: newPresentCount }));
            } else {
                const text = await res.text();
                throw new Error(text || "Error occurred while saving attendance.");
            }
        })
        .catch((err) => {
            console.error(err);
            setSubmitMessage("An error occurred: " + err.message);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (loading) {
        return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading class details...</h2>;
    }

    if (!classDetails) {
        return <h2 style={{ textAlign: "center", marginTop: "50px", color: "red" }}>Class not found!</h2>;
    }

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "My Profile", onClick: () => navigate("/professor/dashboard") },
                    { label: "Schedule", onClick: () => navigate("/professor/schedule") },
                    { label: "My Availability", onClick: () => navigate("/professor/availability") },
                    { label: "Notifications", onClick: () => navigate("/professor/notifications") }
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <button style={styles.backBtn} onClick={() => navigate("/professor/schedule")}>
                    ← Back to Schedule
                </button>

                <div style={styles.detailsCard}>
                    <h1 style={styles.title}>📝 {classDetails.domainName} - Class Details</h1>
                    <p style={styles.subtitle}>Detailed overview and candidate attendance list.</p>
                    
                    {/* Grid sa informacijama */}
                    <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                            <strong>Professor:</strong> {classDetails.professorName}
                        </div>
                        <div style={styles.infoItem}>
                            <strong>Date:</strong> {classDetails.theoryDate}
                        </div>
                        <div style={styles.infoItem}>
                            <strong>Time:</strong> {classDetails.theoryStartTime?.slice(0, 5)} - {classDetails.theoryEndTime?.slice(0, 5)}
                        </div>
                        <div style={styles.infoItem}>
                            <strong>Present Candidates:</strong> <span style={styles.presentBadge}>{classDetails.presentCount ?? 0}</span>
                        </div>
                    </div>

                    {submitMessage && (
                        <div style={{
                            padding: "12px",
                            borderRadius: "6px",
                            textAlign: "center",
                            fontSize: "15px",
                            fontWeight: "bold",
                            marginBottom: "20px",
                            backgroundColor: submitMessage.includes("successfully") ? "#d4edda" : "#f8d7da",
                            color: submitMessage.includes("successfully") ? "#155724" : "#721c24",
                            border: submitMessage.includes("successfully") ? "1px solid #c3e6cb" : "1px solid #f5c6cb"
                        }}>
                            {submitMessage}
                        </div>
                    )}

                    <h2 style={styles.tableTitle}>Candidates Attendance List</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeaderRow}>
                                <th style={styles.th}>First Name</th>
                                <th style={styles.th}>Last Name</th>
                                <th style={styles.th}>Status / Mark Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates && candidates.length > 0 ? (
                                candidates.map((candidate) => {
                                    const isPresent = candidate.status === "PRESENT";
                                    return (
                                        <tr key={candidate.attendanceId} style={styles.row}>
                                            <td style={styles.td}>{candidate.firstName}</td>
                                            <td style={styles.td}>{candidate.lastName}</td>
                                            <td style={styles.td}>
                                                <div 
                                                    style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none", width: "fit-content" }}
                                                    onClick={() => handleStatusToggle(candidate.attendanceId)}
                                                >
                                                    <input 
                                                        type="checkbox"
                                                        checked={isPresent}
                                                        onChange={() => {}} 
                                                        style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#1e3c72" }}
                                                    />
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: isPresent ? "#d4edda" : "#f8d7da",
                                                        color: isPresent ? "#155724" : "#721c24"
                                                    }}>
                                                        {candidate.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ ...styles.td, textAlign: "center", color: "#888", padding: "20px" }}>
                                        No candidates are registered for this class.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                        <button 
                            style={{
                                ...styles.backBtn,
                                backgroundColor: "#1e3c72",
                                color: "white",
                                padding: "12px 30px",
                                fontSize: "15px",
                                marginBottom: "0",
                                border: "none",
                                opacity: (isSubmitting || candidates.length === 0) ? 0.6 : 1
                            }} 
                            onClick={handleSubmitAttendance}
                            disabled={isSubmitting || candidates.length === 0}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Attendance"}
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", minHeight: "100vh" },
    content: { flex: 1, padding: "40px", backgroundColor: "#f4f6f9", fontFamily: "Arial, sans-serif" },
    backBtn: { backgroundColor: "#fff", color: "#1e3c72", border: "1px solid #1e3c72", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginBottom: "20px", transition: "0.2s" },
    detailsCard: { backgroundColor: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 5px 15px rgba(0,0,0,0.06)", borderTop: "6px solid #1e3c72" },
    title: { color: "#1e3c72", fontSize: "26px", marginBottom: "5px" },
    subtitle: { color: "#777", fontSize: "14px", marginBottom: "25px" },
    infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", backgroundColor: "#f8fafd", padding: "20px", borderRadius: "8px", marginBottom: "30px" },
    infoItem: { fontSize: "15px", color: "#333" },
    presentBadge: { backgroundColor: "#1e3c72", color: "white", padding: "3px 8px", borderRadius: "10px", fontWeight: "bold" },
    tableTitle: { color: "#333", fontSize: "20px", marginBottom: "15px" },
    table: { width: "100%", borderCollapse: "collapse" },
    tableHeaderRow: { backgroundColor: "#34495e" },
    th: { padding: "14px", color: "white", textAlign: "left", fontSize: "15px" },
    td: { padding: "14px", borderBottom: "1px solid #eee", fontSize: "14px", color: "#333", verticalAlign: "middle" },
    row: { transition: "0.2s" },
    statusBadge: { padding: "4px 10px", borderRadius: "12px", fontWeight: "bold", fontSize: "12px" }
};

export default ProfessorClassDetails;