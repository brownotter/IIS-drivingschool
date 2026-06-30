import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Instructors() {
    const [instructors, setInstructors] = useState([]);
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [licenceNumber, setLicenceNumber] = useState("");
    const [teachingCategory, setTeachingCategory] = useState("B"); 

    const [selectedInstructor, setSelectedInstructor] = useState(null);
    
    const [isEditing, setIsEditing] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const navigate = useNavigate();

    const fetchInstructorsFromBackend = () => {
        fetch("http://localhost:8080/instructor/all", {
            method: "GET",
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {
                setInstructors(data);
            })
            .catch((error) => console.log("Error fetching instructors:", error));
    };

    useEffect(() => {
        fetchInstructorsFromBackend();
    }, []);

    const handleCreateInstructor = (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        const newInstructor = {
            username,
            password,
            firstName,
            lastName,
            email,
            contact,
            licenceNumber,
            teachingCategory
        };

        fetch("http://localhost:8080/instructor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(newInstructor)
        })
            .then(async(response) => {
                const data = await response.text();

                if (response.ok) {
                    fetchInstructorsFromBackend();
                    // Resetovanje forme
                    setUsername("");
                    setPassword("");
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setContact("");
                    setLicenceNumber("");
                    setTeachingCategory("B");
                    setErrorMessage(""); 
                    setShowForm(false);
                } else {
                    try {
                        const parsedData = JSON.parse(data);
                        setErrorMessage(parsedData.message || data || `Error ${response.status}`);
                    } catch (e) {
                        setErrorMessage(data || `Error ${response.status}: ${response.statusText}`);
                    }
                }
            })
            .catch((error) => setErrorMessage(error.message));
    };

    const handleStatusChange = (newStatus) => {
        if (!selectedInstructor) return;
        setSelectedInstructor({ ...selectedInstructor, status: newStatus });
    };

    const handleUpdateInstructor = (e) => {
        e.preventDefault();
        setErrorMessage(""); 
        
        const originalInstructor = instructors.find(i => i.id === selectedInstructor.id);

        if (isEditing) {
            const instructorUpdateDto = {
                firstName: selectedInstructor.firstName,
                lastName: selectedInstructor.lastName,
                email: selectedInstructor.email,
                contact: selectedInstructor.contact,
                teachingCategory: selectedInstructor.teachingCategory,
                licenceNumber: selectedInstructor.licenceNumber
            };

            fetch(`http://localhost:8080/instructor/${selectedInstructor.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(instructorUpdateDto)
            })
                .then(async (response) => {
                    const data = await response.text(); 
                    
                    if (response.ok) {

                        if (originalInstructor && originalInstructor.status !== selectedInstructor.status) {
                            sendLineStatusUpdate(selectedInstructor.id, selectedInstructor.status);
                        } else {
                            finalizeUpdate();
                        }
                    } else {
                        try {
                            const parsedData = JSON.parse(data);
                            setErrorMessage(parsedData.message || data || `Error ${response.status}`);
                        } catch (e) {
                            setErrorMessage(data || `Error ${response.status}: ${response.statusText}`);
                        }
                    }
                })
                .catch((error) => setErrorMessage(error.message));

        } else if (originalInstructor && originalInstructor.status !== selectedInstructor.status) {
            sendLineStatusUpdate(selectedInstructor.id, selectedInstructor.status);
        } else {
            finalizeUpdate();
        }
    };

    const sendLineStatusUpdate = (id, newStatus) => {
        fetch(`http://localhost:8080/instructor/${id}/status?status=${newStatus}`, {
            method: "PATCH",
            credentials: "include"
        })
            .then(async (response) => {
                const data = await response.text();
                if (response.ok) {
                    finalizeUpdate();
                } else {
                    try {
                        const parsedData = JSON.parse(data);
                        alert(parsedData.message || data);
                    } catch (e) {
                        alert(data || `Error ${response.status}`);
                    }
                }
            })
            .catch((error) => console.log("Error updating status:", error));
    };

    const handleExecuteDelete = () => {
        if (!selectedInstructor) return;

        fetch(`http://localhost:8080/instructor/${selectedInstructor.id}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(async (response) => {
                const data = await response.text();
                if (response.ok) {
                    finalizeUpdate();
                } else {
                    try {
                        const parsedData = JSON.parse(data);
                        alert(parsedData.message || data);
                    } catch (e) {
                        alert(data || `Error ${response.status}`);
                    }
                }
            })
                .catch((error) => console.log("Error deleting instructor:", error));
    };

    const finalizeUpdate = () => {
        fetchInstructorsFromBackend();
        setSelectedInstructor(null);
        setIsEditing(false);
        setShowDeleteConfirm(false);
        setErrorMessage(""); 
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const getInputStyle = (fieldKeyword) => {
        const hasError = errorMessage && errorMessage.toLowerCase().includes(fieldKeyword);
        return {
            ...styles.input,
            borderColor: hasError ? '#d32f2f' : '#ccc',
            backgroundColor: hasError ? '#fff9f9' : 'white'
        };
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
                <div style={styles.header}>
                    <h1>Instructors</h1>
                    <button style={styles.addNavButton} onClick={() => { setErrorMessage(""); setShowForm(true); }}>
                        + Add Instructor
                    </button>
                </div>
                
                <p style={styles.subtitle}>Click on instructor for more details</p>

                <div style={{ display: "flex", gap: "20px", marginBottom: "25px", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>Filter by Category:</label>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={styles.filterSelect}>
                            <option value="ALL">All</option>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="F">F</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>Filter by Status:</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.filterSelect}>
                            <option value="ALL">All</option>
                            <option value="WORKING">Working</option>
                            <option value="VACATION">On Vacation</option>
                            <option value="SICKNESS">Sick Leave</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                </div>

                {showForm && (
                    <div style={styles.modalOverlay} onClick={() => { setShowForm(false); setErrorMessage(""); }}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div style={styles.modalHeader}>
                                <h3>Add New Instructor</h3>
                                <button style={styles.closeModalButton} onClick={() => { setShowForm(false); setErrorMessage(""); }}>✕</button>
                            </div>

                            {errorMessage && (
                                <div style={styles.errorAlert}>⚠️ {errorMessage}</div>
                            )}

                            <form onSubmit={handleCreateInstructor} style={styles.form}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <input style={getInputStyle("username")} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <input style={styles.input} type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                    <input style={styles.input} type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                                <input style={getInputStyle("email")} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <input style={getInputStyle("contact")} type="text" placeholder="Contact Phone" value={contact} onChange={(e) => setContact(e.target.value)} required />
                                <input style={getInputStyle("licence")} type="text" placeholder="Licence Number" value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} required />
                                
                                <label style={styles.label}>Teaching Category:</label>
                                <select style={styles.input} value={teachingCategory} onChange={(e) => setTeachingCategory(e.target.value)}>
                                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="F">F</option>
                                </select>
                                
                                <div style={styles.modalActions}>
                                    <button type="button" style={styles.cancelButton} onClick={() => { setShowForm(false); setErrorMessage(""); }}>Cancel</button>
                                    <button type="submit" style={styles.saveButton}>Save Instructor</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {selectedInstructor && (
                    <div style={styles.modalOverlay} onClick={() => { if(!showDeleteConfirm) finalizeUpdate(); }}>
                        <div style={styles.modalContentRelative} onClick={(e) => e.stopPropagation()}>
                            
                            {showDeleteConfirm && (
                                <div style={styles.deleteOverlayInside}>
                                    <div style={styles.deleteConfirmCard}>
                                        <div style={styles.warningIcon}>⚠️</div>
                                        <h4 style={{ margin: "0 0 10px 0", color: "#d32f2f", fontSize: "18px" }}>Confirm Archiving</h4>
                                        <p style={{ color: "#555", margin: "0 0 20px 0", fontSize: "14px", lineHeight: "1.5" }}>
                                            Are you sure you want to delete instructor <strong>{selectedInstructor.firstName} {selectedInstructor.lastName}</strong>?
                                        </p>
                                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", width: "100%" }}>
                                            <button type="button" style={styles.cancelDeleteButton} onClick={() => setShowDeleteConfirm(false)}>No, Keep</button>
                                            <button type="button" style={styles.confirmDeleteButton} onClick={handleExecuteDelete}>Yes, Archive</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={styles.modalHeader}>
                                <h3>{isEditing ? "Edit Instructor Details" : "Instructor Details"}</h3>
                                <button style={styles.closeModalButton} onClick={() => finalizeUpdate()}>✕</button>
                            </div>

                            {errorMessage && (
                                <div style={styles.errorAlert}>⚠️ {errorMessage}</div>
                            )}

                            <form onSubmit={handleUpdateInstructor} style={styles.form}>
                                {!isEditing ? (
                                    <h2 style={{ fontSize: "24px", margin: "5px 0 10px 0", color: "#333", textAlign: "center" }}>
                                        {selectedInstructor.firstName} {selectedInstructor.lastName}
                                    </h2>
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div>
                                            <label style={styles.label}>First Name:</label>
                                            <input style={styles.input} type="text" value={selectedInstructor.firstName} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, firstName: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label style={styles.label}>Last Name:</label>
                                            <input style={styles.input} type="text" value={selectedInstructor.lastName} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, lastName: e.target.value })} required />
                                        </div>
                                    </div>
                                )}

                                <label style={styles.label}>Email:</label>
                                {isEditing ? (
                                    <input style={getInputStyle("email")} type="email" value={selectedInstructor.email} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} required />
                                ) : (
                                    <div style={styles.readOnlyField}>{selectedInstructor.email}</div>
                                )}

                                <label style={styles.label}>Contact:</label>
                                {isEditing ? (
                                    <input style={getInputStyle("contact")} type="text" value={selectedInstructor.contact} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, contact: e.target.value })} required />
                                ) : (
                                    <div style={styles.readOnlyField}>{selectedInstructor.contact}</div>
                                )}

                                <label style={styles.label}>Licence Number:</label>
                                {isEditing ? (
                                    <input style={getInputStyle("licence")} type="text" value={selectedInstructor.licenceNumber} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, licenceNumber: e.target.value })} required />
                                ) : (
                                    <div style={styles.readOnlyField}>{selectedInstructor.licenceNumber}</div>
                                )}

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div>
                                        <label style={styles.label}>Category:</label>
                                        {isEditing ? (
                                            <select style={styles.input} value={selectedInstructor.teachingCategory} onChange={(e) => setSelectedInstructor({ ...selectedInstructor, teachingCategory: e.target.value })}>
                                                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="F">F</option>
                                            </select>
                                        ) : (
                                            <div style={styles.readOnlyField}>{selectedInstructor.teachingCategory}</div>
                                        )}
                                    </div>
                                    <div>
                                        <label style={styles.label}>Rating ⭐:</label>
                                        <div style={styles.readOnlyField}>{selectedInstructor?.averageRate?.toFixed(1) || "0.0"}</div>
                                    </div>
                                </div>

                                <label style={styles.label}>Status:</label>
                                <select style={styles.input} value={selectedInstructor.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={!isEditing && selectedInstructor.status === "ARCHIVED"}>
                                    <option value="WORKING">Working</option>
                                    <option value="VACATION">On Vacation</option>
                                    <option value="SICKNESS">Sick Leave</option>
                                    {selectedInstructor.status === "ARCHIVED" && (<option value="ARCHIVED">Archived</option>)}
                                </select>

                                <div style={styles.modalActions}>
                                    {isEditing ? (
                                        <button type="button" style={styles.deleteButton} onClick={() => setShowDeleteConfirm(true)}>Delete Instructor</button>
                                    ) : (
                                        <button type="button" style={styles.changeDetailsButton} onClick={() => { setErrorMessage(""); setIsEditing(true); }}>Change Details</button>
                                    )}
                                    <button type="button" style={styles.cancelButton} onClick={() => finalizeUpdate()}>Cancel</button>
                                    <button type="submit" style={styles.saveButton}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div style={styles.gridContainer}>
                    {instructors
                        .filter((i) => {
                            const matchesCategory = categoryFilter === "ALL" || i.teachingCategory === categoryFilter;
                            const matchesStatus = statusFilter === "ALL" || i.status === statusFilter;
                            return matchesCategory && matchesStatus;
                        })
                        .map((i) => (
                            <div key={i.id} style={styles.instructorCard} onClick={() => setSelectedInstructor({ ...i })}>
                                <h2 style={styles.cardTitle}>{i.firstName} {i.lastName}</h2>
                                <div style={styles.cardBody}>
                                    <p><strong>Category:</strong> {i.teachingCategory}</p>
                                    <p><strong>Rating:</strong> ⭐ {i.averageRate ? i.averageRate.toFixed(1) : "0.0"}</p>
                                    <p style={{marginTop: "8px"}}>
                                        <strong>Status:</strong>{" "}
                                        <span style={{ 
                                            ...styles.statusBadge, 
                                            backgroundColor: i.status === "WORKING" ? "#d4edda" : i.status === "VACATION" ? "#fff3cd" : i.status === "SICKNESS" ? "#f8d7da" : "#e2e3e5", 
                                            color: i.status === "WORKING" ? "#155724" : i.status === "VACATION" ? "#856404" : i.status === "SICKNESS" ? "#721c24" : "#383d41" 
                                        }}>
                                            {i.status.replace("_", " ")}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
    content: { flex: 1, padding: "40px", backgroundColor: "#f4f6f9" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #ddd", paddingBottom: "10px" },
    addNavButton: { padding: "10px 22px", backgroundColor: "#2a5298", color: "white", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", marginLeft: "auto", boxShadow: "0 2px 5px rgba(42, 82, 152, 0.2)" },
    subtitle: { color: "#6c757d", fontStyle: "italic", marginTop: "10px", marginBottom: "20px" },
    gridContainer: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginTop: "10px" },
    instructorCard: { backgroundColor: "white", border: "2px solid #ccc", borderRadius: "12px", padding: "20px", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "150px" },
    cardTitle: { margin: "0 0 10px 0", fontSize: "22px", color: "#333" },
    cardBody: { fontSize: "15px", color: "#555", lineHeight: "1.6" },
    statusBadge: { padding: "4px 10px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-block", textAlign: "center" },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "480px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "15px" },
    modalContentRelative: { position: "relative", backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "480px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "15px", overflow: "hidden" },
    deleteOverlayInside: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10, padding: "20px" },
    deleteConfirmCard: { backgroundColor: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #eaeaea", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
    warningIcon: { fontSize: "36px", marginBottom: "8px" },
    cancelDeleteButton: { padding: "10px 20px", backgroundColor: "#e2e3e5", color: "#383d41", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
    confirmDeleteButton: { padding: "10px 20px", backgroundColor: "#d32f2f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "5px" },
    closeModalButton: { border: "none", backgroundColor: "transparent", fontSize: "18px", cursor: "pointer", color: "#888" },
    form: { display: "flex", flexDirection: "column", gap: "14px" },
    input: { padding: "11px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", fontFamily: "Arial, sans-serif", width: "100%", boxSizing: "border-box" },
    label: { fontSize: "14px", fontWeight: "bold", color: "#555", marginBottom: "-5px" },
    readOnlyField: { padding: "8px 0", fontSize: "16px", color: "#333", borderBottom: "1px dashed #eee", marginTop: "-2px" },
    modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
    changeDetailsButton: { padding: "10px 18px", backgroundColor: "white", color: "#2a5298", border: "1px solid #2a5298", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginRight: "auto" },
    deleteButton: { padding: "10px 18px", backgroundColor: "#fff5f5", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginRight: "auto" },
    cancelButton: { padding: "10px 18px", backgroundColor: "#e2e3e5", color: "#383d41", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    saveButton: { padding: "10px 18px", backgroundColor: "#2a5298", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    errorAlert: { color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px', marginBottom: '5px', border: '1px solid #d32f2f', fontWeight: 'bold', fontSize: '14px' },
    filterSelect: { padding: "10px 20px 10px 15px", borderRadius: "8px", border: "2px solid #2a5298", backgroundColor: "white", fontWeight: "bold", color: "#2a5298", cursor: "pointer", fontSize: "14px", outline: "none", minWidth: "160px" }
};

export default Instructors;