import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function InstructorCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const navigate = useNavigate();

    const loggedUser = JSON.parse(localStorage.getItem("user")) || {};
    const instructorFullName = loggedUser.firstName && loggedUser.lastName 
        ? `${loggedUser.firstName} ${loggedUser.lastName}` 
        : "Logged Instructor";

    useEffect(() => {
        fetch("http://localhost:8080/instructor/candidates", {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status === 401 || res.status === 403) {
                throw new Error("Unauthorized. Please log in again.");
            }
            if (!res.ok) {
                throw new Error("Failed to load candidates data.");
            }
            return res.json();
        })
        .then((data) => {
            setCandidates(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
            console.error(err);
        });
    }, []);

    const handleCardClick = (candidateId) => {
        const localFallback = candidates.find(c => c.id === candidateId);

        fetch(`http://localhost:8080/instructor/candidates/${candidateId}`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch candidate details from server.");
            return res.json();
        })
        .then(data => {
            setSelectedCandidate({
                ...data,
                assignedInstructor: data.assignedInstructor || instructorFullName,
                classes: data.classes || [],
                recommendation: data.recommendation || "No recommendation available at this moment."
            });
        })
        .catch(err => {
            console.error("Backend endpoint error:", err);
            
            if (localFallback) {
                setSelectedCandidate({
                    ...localFallback,
                    assignedInstructor: instructorFullName,
                    classes: [],
                    recommendation: "No recommendation available at this moment."
                });
            }
        });
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (loading) return <div style={styles.content}><h2>Loading...</h2></div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "My Profile", onClick: () => navigate("/instructor/profile") },
                    { label: "Schedule", onClick: () => navigate("/instructor/schedule") },
                    { label: "Candidates", onClick: () => navigate("/instructor/candidates") },
                    { label: "Vehicles", onClick: () => navigate("/instructor/vehicles") },
                    { label: "Notifications", onClick: () => navigate("/instructor/notifications") }
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <div style={styles.header}>
                    <h1>Candidates</h1>
                </div>
                
                <p style={styles.subtitle}>Click on a candidate to view detailed information and training history</p>

                <div style={styles.gridContainer}>
                    {candidates.length === 0 ? (
                        <p style={styles.noCandidates}>You currently have no candidates assigned for practical training.</p>
                    ) : (
                        candidates.map((candidate) => (
                            <div 
                                key={candidate.id} 
                                style={styles.candidateCard}
                                onClick={() => handleCardClick(candidate.id)}
                            >
                                <h2 style={styles.cardTitle}>{candidate.firstName} {candidate.lastName}</h2>
                                <div style={styles.cardBody}>
                                    <p><strong>Category:</strong> {candidate.targetCategory || "Not selected"}</p>
                                    <p>
                                        <strong>Classes attended:</strong> 
                                        <span style={styles.classesBadge}>
                                            {candidate.practiceClassesCount} / 40
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedCandidate && (
                    <div style={styles.modalOverlay} onClick={() => setSelectedCandidate(null)}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            
                            <div style={styles.modalHeader}>
                                <button style={styles.cancelButton} onClick={() => setSelectedCandidate(null)}>Cancel</button>
                            </div>

                            <div style={styles.topDetailsContainer}>
                                <div style={styles.candidateInfoSide}>
                                    <h1 style={styles.modalCandidateName}>{selectedCandidate.firstName} {selectedCandidate.lastName}</h1>
                                    <p style={styles.infoText}><strong>Category:</strong> {selectedCandidate.targetCategory || "Not selected"}</p>
                                    <p style={styles.infoText}><strong>Number of attended classes:</strong> {selectedCandidate.practiceClassesCount || 0}</p>
                                    <p style={styles.infoText}><strong>Assigned instructor:</strong> {selectedCandidate.assignedInstructor}</p>
                                </div>
                                
                                <div style={styles.recommendationSide}>
                                    <h3 style={styles.recommendationTitle}>Recommendation for next class:</h3>
                                    <div style={{
                                        ...styles.recommendationBox,
                                        backgroundColor: selectedCandidate.recommendation?.includes("Bad impression") ? "#fff5f5" : "#f6fff6",
                                        borderColor: selectedCandidate.recommendation?.includes("Bad impression") ? "#ffb3b3" : "#b3ffb3"
                                    }}>
                                        {selectedCandidate.recommendation}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>ORDER NUM</th>
                                            <th style={styles.th}>TOPIC</th>
                                            <th style={styles.th}>CLASS DATE</th>
                                            <th style={styles.th}>START TIME</th>
                                            <th style={styles.th}>END TIME</th>
                                            <th style={styles.th}>NOTE</th>
                                            <th style={styles.th}>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCandidate.classes && selectedCandidate.classes.length > 0 ? (
                                            selectedCandidate.classes.map((cls, idx) => (
                                                <tr key={idx} style={styles.tr}>
                                                    <td style={{...styles.td, fontWeight: "bold"}}>{cls.orderNum}</td>
                                                    <td style={styles.td}>{cls.topicName || "No topic"}</td>
                                                    <td style={styles.td}>{cls.classDate}</td>
                                                    <td style={styles.td}>{cls.startTime}</td>
                                                    <td style={styles.td}>{cls.endTime}</td>
                                                    <td style={styles.td}>
                                                        {cls.status === "IN_PROGRESS" ? (
                                                            <button style={styles.addNoteBtn} onClick={() => alert("Opening note entry window...")}>Add Note</button>
                                                        ) : (
                                                            cls.note || <span style={{color: "#bbb", fontStyle: "italic"}}>No note</span>
                                                        )}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span style={{
                                                            ...styles.statusBadge, 
                                                            backgroundColor: cls.status === "COMPLETED" ? "#d4edda" : cls.status === "IN_PROGRESS" ? "#d1ecf1" : "#fff3cd",
                                                            color: cls.status === "COMPLETED" ? "#155724" : cls.status === "IN_PROGRESS" ? "#0c5460" : "#856404"
                                                        }}>
                                                            {cls.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{textAlign: "center", padding: "20px", color: "#888"}}>The candidate has no registered classes.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
    content: { flex: 1, padding: "40px", backgroundColor: "#f4f6f9" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #ddd", paddingBottom: "10px" },
    subtitle: { color: "#6c757d", fontStyle: "italic", marginTop: "10px", marginBottom: "20px" },
    gridContainer: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginTop: "10px" },
    candidateCard: { backgroundColor: "white", border: "2px solid #ccc", borderRadius: "12px", padding: "20px", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px", transition: "transform 0.2s", ":hover": { transform: "translateY(-2px)" } },
    cardTitle: { margin: "0 0 10px 0", fontSize: "22px", color: "#333" },
    cardBody: { fontSize: "15px", color: "#555", lineHeight: "1.6" },
    classesBadge: { marginLeft: "8px", backgroundColor: "#e2e3e5", color: "#383d41", padding: "3px 8px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px" },
    noCandidates: { color: "#777", fontSize: "16px", gridColumn: "1 / -1" },
    error: { color: "#d8000c", backgroundColor: "#ffe5e5", padding: "15px", textAlign: "center", margin: "40px auto", maxWidth: "500px", borderRadius: "6px", border: "1px solid #d8000c" },
    
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { backgroundColor: "white", padding: "40px", borderRadius: "12px", width: "85%", maxWidth: "1100px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "25px" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    cancelButton: { padding: "10px 24px", backgroundColor: "white", color: "#333", border: "2px solid #ccc", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", marginLeft: "auto" },
    topDetailsContainer: { display: "flex", justifyContent: "space-between", gap: "40px", borderBottom: "1px solid #eee", paddingBottom: "25px" },
    candidateInfoSide: { flex: 1, display: "flex", flexDirection: "column", gap: "10px" },
    modalCandidateName: { fontSize: "32px", margin: "0 0 10px 0", color: "#111", borderBottom: "2px solid #ccc", paddingBottom: "5px", display: "inline-block", maxWidth: "max-content" },
    infoText: { fontSize: "16px", color: "#444", margin: "4px 0" },
    recommendationSide: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
    recommendationTitle: { fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 },
    recommendationBox: { border: "1px solid", borderRadius: "6px", padding: "15px", minHeight: "100px", maxHeight: "120px", overflowY: "auto", fontSize: "15px", lineHeight: "1.5", color: "#555", transition: "all 0.3s ease" },
    
    tableContainer: { marginTop: "10px", overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" },
    th: { backgroundColor: "#f2f2f2", color: "#333", padding: "12px", border: "1px solid #ddd", fontWeight: "bold", textAlign: "center" },
    tr: { borderBottom: "1px solid #ddd" },
    td: { padding: "12px", border: "1px solid #ddd", color: "#444", verticalAlign: "middle", textAlign: "center" },
    statusBadge: { padding: "4px 10px", borderRadius: "12px", fontWeight: "bold", fontSize: "12px" },
    addNoteBtn: { padding: "6px 12px", backgroundColor: "#fff", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", fontWeight: "500", fontSize: "13px", boxShadow: "2px 2px 0px #111" }
};

export default InstructorCandidates;