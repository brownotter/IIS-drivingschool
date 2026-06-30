import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function TheorySchedulePage() {
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState("manual");

    const [professors, setProfessors] = useState([]);
    const [domains, setDomains] = useState([]);
    const [candidates, setCandidates] = useState([]);
    

    const [theoryDate, setTheoryDate] = useState("");
    const [theoryStartTime, setTheoryStartTime] = useState("10:00");
    const [theoryEndTime, setTheoryEndTime] = useState("11:30");
    const [capacity, setCapacity] = useState(20);
    const [selectedProfessorId, setSelectedProfessorId] = useState("");
    const [selectedDomainId, setSelectedDomainId] = useState("");
    const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
    const [searchCandidateQuery, setSearchCandidateQuery] = useState("");

    const [message, setMessage] = useState({ text: "", isError: false });

    useEffect(() => {
        fetch("http://localhost:8080/user/professors")
            .then((res) => res.json())
            .then((data) => setProfessors(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error loading professors:", err));

        fetch("http://localhost:8080/api/theory-classes/domains") 
            .then((res) => res.json())
            .then((data) => {
                console.log("Loaded domains from backend:", data);
                setDomains(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Error loading domains:", err));

        fetch("http://localhost:8080/candidate/all") 
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const theoryCandidates = data.filter(c => c.status === "THEORY" || c.candidateStatus === "THEORY");
                    setCandidates(theoryCandidates);
                } else {
                    setCandidates([]);
                }
            })
            .catch((err) => console.error("Error loading candidates:", err));
    }, []);

   
    const handleToggleCandidate = (id) => {
        if (selectedCandidateIds.includes(id)) {
            setSelectedCandidateIds(selectedCandidateIds.filter(cId => cId !== id));
        } else {
            setSelectedCandidateIds([...selectedCandidateIds, id]);
        }
    };

    const handleSelectAllCandidates = () => {
        const filtered = candidates.filter(c => 
            `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase().includes(searchCandidateQuery.toLowerCase())
        );
        const filteredIds = filtered.map(c => c.id);
        setSelectedCandidateIds([...new Set([...selectedCandidateIds, ...filteredIds])]);
    };

    const handleDeselectAllCandidates = () => {
        setSelectedCandidateIds([]);
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        setMessage({ text: "", isError: false });

        if (!theoryDate || !selectedProfessorId || !selectedDomainId) {
            setMessage({ text: "Please fill in all required fields (Date, Professor, Domain).", isError: true });
            return;
        }

        const createDto = {
            theoryDate: theoryDate,
            theoryStartTime: `${theoryStartTime}:00`,
            theoryEndTime: `${theoryEndTime}:00`,
            capacity: parseInt(capacity),
            professorId: parseInt(selectedProfessorId),
            domainId: parseInt(selectedDomainId),
            candidateIds: selectedCandidateIds
        };

        fetch("http://localhost:8080/api/theory-classes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(createDto)
        })
        .then(async (res) => {
            const rawText = await res.text();
            if (!res.ok) {
                try {
                    const parsed = JSON.parse(rawText);
                    throw new Error(parsed.message || "Error creating class.");
                } catch {
                    throw new Error(rawText || "Error on server.");
                }
            }
            return rawText;
        })
        .then(() => {
            setMessage({ text: "Class created successfully!", isError: false });
            setTheoryDate("");
            setSelectedCandidateIds([]);
            setSelectedProfessorId("");
            setSelectedDomainId("");
        })
        .catch(err => {
            if (err.message.includes("Professor is not available")) {
                setMessage({ text: "Professor is not available in this period!", isError: true });
            } else if (err.message.includes("Professor already has class")) {
                setMessage({ text: "Professor already has a class scheduled in the selected time slot!", isError: true });
            } else {
                setMessage({ text: err.message, isError: true });
            }
        });
    };

    const filteredCandidates = candidates.filter(c => {
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        return fullName.includes(searchCandidateQuery.toLowerCase());
    });

    const activeProfessor = professors.find(p => String(p.id) === String(selectedProfessorId));
    const activeDomain = domains.find(d => String(d.domainId) === String(selectedDomainId));

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
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
                <div style={styles.wireframeBox}>
                    <h1 style={styles.mainTitle}>Create Theory Schedule</h1>

                    <div style={styles.tabContainer}>
                        <button 
                            type="button"
                            style={{...styles.tabBtn, ...(activeTab === "manual" ? styles.activeTabBtn : {})}}
                            onClick={() => { setActiveTab("manual"); setMessage({text:"", isError:false}); }}
                        >
                            Create schedule
                        </button>
                        <button 
                            type="button"
                            style={{...styles.tabBtn, ...(activeTab === "schedule" ? styles.activeTabBtn : {})}}
                            onClick={() => navigate("/admin/theory-schedule-view")}
                        >
                            View Schedule
                        </button>
                    </div>

                    {message.text && (
                        <div style={{
                            ...styles.statusMessage,
                            backgroundColor: message.isError ? "#f8d7da" : "#d4edda",
                            color: message.isError ? "#721c24" : "#155724"
                        }}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === "manual" && (
                        <form onSubmit={handleManualSubmit} style={styles.formWidth}>
                            
                            {/* BLOK 1: Date & Time Slot */}
                            <div style={styles.sectionBlock}>
                                <div style={styles.inlineSectionRow}>
                                    <span style={styles.blockLabel}>Date & Time Slot</span>
                                    <div style={styles.rightInputsGroup}>
                                        <input type="date" value={theoryDate} onChange={(e) => setTheoryDate(e.target.value)} style={styles.wireframeInput} />
                                        <span style={{fontSize: "14px"}}>From:</span>
                                        <input type="time" value={theoryStartTime} onChange={(e) => setTheoryStartTime(e.target.value)} style={{...styles.wireframeInput, width: "100px"}} />
                                        <span style={{fontSize: "14px"}}>To:</span>
                                        <input type="time" value={theoryEndTime} onChange={(e) => setTheoryEndTime(e.target.value)} style={{...styles.wireframeInput, width: "100px"}} />
                                        <input type="number" placeholder="Cap." value={capacity} onChange={(e) => setCapacity(e.target.value)} style={{...styles.wireframeInput, width: "60px"}} title="Capacity" />
                                    </div>
                                </div>
                            </div>

                            <div style={styles.sectionBlock}>
                                <div style={styles.inlineSectionRow}>
                                    <span style={styles.blockLabel}>Professor & Domain</span>
                                    <div style={styles.rightInputsGroup}>
                                        
                                        <select value={selectedProfessorId} onChange={(e) => setSelectedProfessorId(e.target.value)} style={styles.wireframeSelect}>
                                            <option value="">Select Professor</option>
                                            {professors.map(p => (
                                                <option key={p.id} value={String(p.id)}>{p.firstName} {p.lastName}</option>
                                            ))}
                                        </select>

                                        <select value={selectedDomainId} onChange={(e) => setSelectedDomainId(e.target.value)} style={styles.wireframeSelect}>
                                            <option value="">Select Domain</option>
                                            {domains.map((d, index) => (
                                                <option key={d.domainId || index} value={String(d.domainId)}>
                                                    {d.domainOrderNumber || index + 1}. {d.domainName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.sectionBlock}>
                                <span style={{...styles.blockLabel, display: "block", marginBottom: "15px"}}>Candidates</span>
                                
                                <div style={styles.candidateActionHeader}>
                                    <div style={styles.searchContainer}>
                                        <span style={{marginRight: "5px"}}>🔍</span>
                                        <input 
                                            type="text" 
                                            placeholder="search" 
                                            value={searchCandidateQuery}
                                            onChange={(e) => setSearchCandidateQuery(e.target.value)}
                                            style={styles.searchInsideInput}
                                        />
                                    </div>
                                    <div style={{gap: "10px", display: "flex"}}>
                                        <button type="button" onClick={handleSelectAllCandidates} style={styles.miniWireframeBtn}>Select All</button>
                                        <button type="button" onClick={handleDeselectAllCandidates} style={styles.miniWireframeBtn}>Deselect all</button>
                                    </div>
                                </div>

                                <div style={styles.candidatesGrid}>
                                    {filteredCandidates.map(c => {
                                        const isChecked = selectedCandidateIds.includes(c.id);
                                        return (
                                            <div 
                                                key={c.id} 
                                                style={{...styles.candidateCard, backgroundColor: isChecked ? "#e6f4ea" : "#ffffff"}}
                                                onClick={() => handleToggleCandidate(c.id)}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={isChecked}
                                                    onChange={() => {}} 
                                                    style={{marginRight: "8px", pointerEvents: "none"}} 
                                                />
                                                <div style={{fontSize: "12px", lineHeight: "1.2"}}>
                                                    <strong>{c.firstName} {c.lastName}</strong>
                                                    <div style={{color: "#666", fontSize: "11px"}}>ID: #{c.id}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {filteredCandidates.length === 0 && (
                                        <div style={{gridColumn: "1/-1", textAlign: "center", color: "#888", fontSize: "14px", padding: "10px"}}>
                                            Nema pronađenih kandidata.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.sectionBlock}>
                                <span style={{...styles.blockLabel, display: "block", marginBottom: "10px"}}>Summary</span>
                                <div style={styles.summaryContentRow}>
                                    <div style={styles.summaryTextLines}>
                                        <div><strong>Date:</strong> {theoryDate || "_______"} ({theoryStartTime} - {theoryEndTime})</div>
                                        <div><strong>Professor:</strong> {activeProfessor ? `${activeProfessor.firstName} ${activeProfessor.lastName}` : "_______"}</div>
                                        <div><strong>Lesson:</strong> {activeDomain ? activeDomain.domainName : "_______"}</div>
                                        <div><strong>Candidates:</strong> {selectedCandidateIds.length} selektovano (Maks. {capacity})</div>
                                    </div>
                                    <div style={styles.summaryActionsRight}>
                                        <button 
                                            type="button" 
                                            onClick={() => { 
                                                handleDeselectAllCandidates(); 
                                                setTheoryDate(""); 
                                                setSelectedProfessorId(""); 
                                                setSelectedDomainId(""); 
                                                setTheoryStartTime("10:00");
                                                setTheoryEndTime("11:30");
                                            }} 
                                            style={styles.bottomWireframeBtn}
                                        >
                                            Reset Form
                                        </button>
                                        <button type="submit" style={{...styles.bottomWireframeBtn, backgroundColor: "#1e3c72"}}>Create Class</button>
                                    </div>
                                </div>
                            </div>

                        </form>
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

    wireframeBox: {
        width: "100%",
        maxWidth: "950px",
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
        marginBottom: "25px"
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

    formWidth: {
        width: "100%"
    },

    statusMessage: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "20px"
    },
    
    sectionBlock: {
        backgroundColor: "white",
        border: "1px solid #e6e6e6",
        borderRadius: "10px",
        padding: "20px",
        width: "100%",
        marginBottom: "20px",
        boxSizing: "border-box",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    },

    inlineSectionRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap",
        gap: "15px"
    },

    blockLabel: {
        fontSize: "17px",
        fontWeight: "bold",
        color: "#1e3c72"
    },

    rightInputsGroup: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap"
    },

    wireframeInput: {
        padding: "9px 10px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none"
    },

    wireframeSelect: {
        padding: "9px 10px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        fontSize: "14px",
        minWidth: "150px",
        outline: "none",
        backgroundColor: "white"
    },

    candidateActionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        gap: "15px",
        flexWrap: "wrap"
    },

    searchContainer: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d9d9d9",
        padding: "8px 12px",
        borderRadius: "20px",
        width: "220px",
        backgroundColor: "white"
    },

    searchInsideInput: {
        border: "none",
        outline: "none",
        fontSize: "14px",
        width: "100%"
    },

    miniWireframeBtn: {
        padding: "7px 12px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#2a5298",
        color: "white",
        fontSize: "12px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    candidatesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "10px",
        maxHeight: "170px",
        overflowY: "auto",
        border: "1px solid #e6e6e6",
        borderRadius: "10px",
        padding: "12px",
        backgroundColor: "#f9fbfd"
    },

    candidateCard: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d9d9d9",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        userSelect: "none",
        backgroundColor: "white"
    },

    summaryContentRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        flexWrap: "wrap",
        gap: "15px"
    },

    summaryTextLines: {
        fontSize: "14px",
        lineHeight: "1.7",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        color: "#333"
    },

    summaryActionsRight: {
        display: "flex",
        gap: "12px"
    },

    bottomWireframeBtn: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#1e3c72",
        color: "white",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    }
   
};

export default TheorySchedulePage;