import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [registrationPlate, setRegistrationPlate] = useState("");
    const [manufactureYear, setManufactureYear] = useState("");
    const [category, setCategory] = useState("B"); 
    
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    
    const [isEditing, setIsEditing] = useState(false);
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const navigate = useNavigate();

    const fetchVehiclesFromBackend = () => {
        fetch("http://localhost:8080/vehicle/all", {
            method: "GET",
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {
                setVehicles(data);
            })
            .catch((error) => console.log("Error fetching vehicles:", error));
    };

    useEffect(() => {
        fetchVehiclesFromBackend();
    }, []);

    const handleCreateVehicle = (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        const newVehicle = {
            brand,
            model,
            registrationPlate,
            manufactureYear: parseInt(manufactureYear),
            category
        };

        fetch("http://localhost:8080/vehicle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(newVehicle)
        })
            .then(async(response) => {
                const data = await response.text();

                if (response.ok) {
                    fetchVehiclesFromBackend();
                    setBrand("");
                    setModel("");
                    setRegistrationPlate("");
                    setManufactureYear("");
                    setCategory("B");
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
        if (!selectedVehicle) return;
        setSelectedVehicle({ ...selectedVehicle, status: newStatus });
    };

    const handleUpdateVehicle = (e) => {
        e.preventDefault();
        setErrorMessage(""); 
        
        const originalVehicle = vehicles.find(v => v.id === selectedVehicle.id);

        if (isEditing) {
            const vehicleUpdateDto = {
                brand: selectedVehicle.brand,
                model: selectedVehicle.model,
                registrationPlate: selectedVehicle.registrationPlate,
                manufactureYear: parseInt(selectedVehicle.manufactureYear),
                category: selectedVehicle.category,
                status: selectedVehicle.status
            };

            fetch(`http://localhost:8080/vehicle/${selectedVehicle.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(vehicleUpdateDto)
                    })
                    .then(async (response) => {
                        const data = await response.text(); 
                        
                        if (response.ok) {
                            finalizeUpdate();
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

        } else if (originalVehicle && originalVehicle.status !== selectedVehicle.status) {
            sendLineStatusUpdate(selectedVehicle.id, selectedVehicle.status);
        } else {
            finalizeUpdate();
        }
    };

    const sendLineStatusUpdate = (id, newStatus) => {
        fetch(`http://localhost:8080/vehicle/${id}/status?status=${newStatus}`, {
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
        if (!selectedVehicle) return;

        fetch(`http://localhost:8080/vehicle/${selectedVehicle.id}`, {
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
            .catch((error) => console.log("Error deleting vehicle:", error));
    };

    const finalizeUpdate = () => {
        fetchVehiclesFromBackend();
        setSelectedVehicle(null);
        setIsEditing(false);
        setShowDeleteConfirm(false);
        setErrorMessage(""); 
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "My Profile", onClick: () => navigate("/admin/profile") },
                    { label: "Schedule", onClick: () => navigate("/admin/theory-schedule") },
                    { label: "Candidates", onClick: () => navigate("/admin/candidates") },
                    { label: "Vehicles", onClick: () => navigate("/admin/vehicles") },
                    { label: "Notifications", onClick: () => navigate("/admin/notifications") }
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <div style={styles.header}>
                    <h1>Vehicles</h1>
                    <button style={styles.addNavButton} onClick={() => { setErrorMessage(""); setShowForm(true); }}>
                        + Add Vehicle
                    </button>
                </div>
                
                <p style={styles.subtitle}>Click on vehicle for more details</p>

                <div style={{ display: "flex", gap: "20px", marginBottom: "25px", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>Filter by Category:</label>
                        <select 
                            value={categoryFilter} 
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ 
                                padding: "10px 20px 10px 15px", 
                                borderRadius: "8px", 
                                border: "2px solid #2a5298", 
                                backgroundColor: "white", 
                                fontWeight: "bold", 
                                color: "#2a5298", 
                                cursor: "pointer", 
                                fontSize: "14px",
                                outline: "none",
                                minWidth: "150px"
                            }}
                        >
                            <option value="ALL">All</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>Filter by Status:</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ 
                                padding: "10px 20px 10px 15px", 
                                borderRadius: "8px", 
                                border: "2px solid #2a5298", 
                                backgroundColor: "white", 
                                fontWeight: "bold", 
                                color: "#2a5298", 
                                cursor: "pointer", 
                                fontSize: "14px",
                                outline: "none",
                                minWidth: "150px"
                            }}
                        >
                            <option value="ALL">All</option>
                            <option value="RUNNING">Running</option>
                            <option value="TECHNICAL_INSPECTION">Technical Inspection</option>
                            <option value="MALFUNCTION">Malfunction</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                </div>

                {showForm && (
                    <div style={styles.modalOverlay} onClick={() => { setShowForm(false); setErrorMessage(""); }}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div style={styles.modalHeader}>
                                <h3>Add New Vehicle</h3>
                                <button style={styles.closeModalButton} onClick={() => { setShowForm(false); setErrorMessage(""); }}>✕</button>
                            </div>

                            {errorMessage && (
                                <div style={{
                                    color: '#d32f2f',
                                    backgroundColor: '#ffebee',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                    border: '1px solid #d32f2f',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    ⚠️ {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleCreateVehicle} style={styles.form}>
                                <input style={styles.input} type="text" placeholder="Brand (e.g. Volkswagen)" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                                <input style={styles.input} type="text" placeholder="Model (e.g. Golf 7)" value={model} onChange={(e) => setModel(e.target.value)} required />
                                
                                <input 
                                    style={{
                                        ...styles.input,
                                        borderColor: errorMessage && errorMessage.toLowerCase().includes("tablic") ? '#d32f2f' : '#ccc',
                                        backgroundColor: errorMessage && errorMessage.toLowerCase().includes("tablic") ? '#fff9f9' : 'white'
                                    }} 
                                    type="text" 
                                    placeholder="Registration Plate (e.g. NS-123-AA)" 
                                    value={registrationPlate} 
                                    onChange={(e) => {
                                        if (errorMessage) setErrorMessage("");
                                        setRegistrationPlate(e.target.value);
                                    }} 
                                    required 
                                />

                                <input style={styles.input} type="number" placeholder="Manufacture Year" value={manufactureYear} onChange={(e) => setManufactureYear(e.target.value)} required />
                                
                                <label style={styles.label}>Vehicle Category:</label>
                                <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="F">F</option>
                                </select>
                                
                                <div style={styles.modalActions}>
                                    <button type="button" style={styles.cancelButton} onClick={() => { setShowForm(false); setErrorMessage(""); }}>Cancel</button>
                                    <button type="submit" style={styles.saveButton}>Save Vehicle</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {selectedVehicle && (
                    <div style={styles.modalOverlay} onClick={() => { if(!showDeleteConfirm) finalizeUpdate(); }}>
                        <div style={styles.modalContentRelative} onClick={(e) => e.stopPropagation()}>
                            
                            {showDeleteConfirm && (
                                <div style={styles.deleteOverlayInside}>
                                    <div style={styles.deleteConfirmCard}>
                                        <div style={styles.warningIcon}>⚠️</div>
                                        <h4 style={{ margin: "0 0 10px 0", color: "#d32f2f", fontSize: "18px" }}>Confirm Archiving</h4>
                                        <p style={{ color: "#555", margin: "0 0 20px 0", fontSize: "14px", lineHeight: "1.5" }}>
                                            Are you sure you want to archive <strong>{selectedVehicle.brand} {selectedVehicle.model}</strong>? This action cannot be undone easily.
                                        </p>
                                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", width: "100%" }}>
                                            <button type="button" style={styles.cancelDeleteButton} onClick={() => setShowDeleteConfirm(false)}>No, Keep it</button>
                                            <button type="button" style={styles.confirmDeleteButton} onClick={handleExecuteDelete}>Yes, Archive</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={styles.modalHeader}>
                                <h3>{isEditing ? "Edit Vehicle Details" : "Vehicle Details"}</h3>
                                <button style={styles.closeModalButton} onClick={() => finalizeUpdate()}>✕</button>
                            </div>

                            {errorMessage && (
                                <div style={{
                                    color: '#d32f2f',
                                    backgroundColor: '#ffebee',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '15px',
                                    border: '1px solid #d32f2f',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    ⚠️ {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleUpdateVehicle} style={styles.form}>
                                {!isEditing ? (
                                    <h2 style={{ fontSize: "24px", margin: "5px 0 10px 0", color: "#333", textAlign: "center" }}>
                                        {selectedVehicle.brand} {selectedVehicle.model}
                                    </h2>
                                ) : (
                                    <>
                                        <label style={styles.label}>Brand:</label>
                                        <input style={styles.input} type="text" value={selectedVehicle.brand} onChange={(e) => setSelectedVehicle({ ...selectedVehicle, brand: e.target.value })} required />
                                        <label style={styles.label}>Model:</label>
                                        <input style={styles.input} type="text" value={selectedVehicle.model} onChange={(e) => setSelectedVehicle({ ...selectedVehicle, model: e.target.value })} required />
                                    </>
                                )}

                                <label style={styles.label}>Category:</label>
                                {isEditing ? (
                                    <select style={styles.input} value={selectedVehicle.category} onChange={(e) => setSelectedVehicle({ ...selectedVehicle, category: e.target.value })}>
                                        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="F">F</option>
                                    </select>
                                ) : (
                                    <div style={styles.readOnlyField}>{selectedVehicle.category}</div>
                                )}

                                <label style={styles.label}>Status:</label>
                                <select style={styles.input} value={selectedVehicle.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={!isEditing && selectedVehicle.status === "ARCHIVED"}>
                                    <option value="RUNNING">Running</option>
                                    <option value="TECHNICAL_INSPECTION">Technical Inspection</option>
                                    <option value="MALFUNCTION">Malfunction</option>
                                    {selectedVehicle.status === "ARCHIVED" && (<option value="ARCHIVED">Archived</option>)}
                                </select>

                                <label style={styles.label}>Registration Plate:</label>
                                {isEditing ? (
                                    <input 
                                        style={{ 
                                            ...styles.input, 
                                            borderColor: errorMessage && errorMessage.toLowerCase().includes("tablic") ? '#d32f2f' : '#ccc',
                                            backgroundColor: errorMessage && errorMessage.toLowerCase().includes("tablic") ? '#fff9f9' : 'white'
                                        }} 
                                        type="text" 
                                        value={selectedVehicle.registrationPlate} 
                                        onChange={(e) => {
                                            if (errorMessage) setErrorMessage("");
                                            setSelectedVehicle({ ...selectedVehicle, registrationPlate: e.target.value });
                                        }} 
                                        required 
                                    />
                                ) : (
                                    <div style={styles.readOnlyField}>{selectedVehicle.registrationPlate}</div>
                                )}

                                <label style={styles.label}>Manufacture Year:</label>
                                {isEditing ? (
                                    <input style={styles.input} type="number" value={selectedVehicle.manufactureYear} onChange={(e) => setSelectedVehicle({ ...selectedVehicle, manufactureYear: parseInt(e.target.value) })} required />
                                ) : (
                                    <div style={styles.readOnlyField}>{selectedVehicle.manufactureYear}</div>
                                )}

                                <div style={styles.modalActions}>
                                    {isEditing ? (
                                        <button type="button" style={styles.deleteButton} onClick={() => setShowDeleteConfirm(true)}>Delete Vehicle</button>
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
                    {vehicles
                        .filter((v) => {
                            const matchesCategory = categoryFilter === "ALL" || v.category === categoryFilter;
                            const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
                            return matchesCategory && matchesStatus;
                        })
                        .map((v) => (
                            <div key={v.id} style={styles.vehicleCard} onClick={() => setSelectedVehicle({ ...v })}>
                                <h2 style={styles.cardTitle}>{v.brand} {v.model}</h2>
                                <div style={styles.cardBody}>
                                    <p><strong>Category:</strong> {v.category}</p>
                                    <p><strong>Status:</strong> <span style={{ ...styles.statusBadge, backgroundColor: v.status === "RUNNING" ? "#d4edda" : v.status === "TECHNICAL_INSPECTION" ? "#fff3cd" : v.status === "MALFUNCTION" ? "#f8d7da" : "#e2e3e5", color: v.status === "RUNNING" ? "#155724" : v.status === "TECHNICAL_INSPECTION" ? "#856404" : v.status === "MALFUNCTION" ? "#721c24" : "#383d41" }}>{v.status.replace("_", " ")}</span></p>
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
    addNavButton: { padding: "10px 22px", backgroundColor: "#2a5298", color: "white", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", marginLeft: "auto", boxShadow: "0 2px 5px rgba(42, 82, 152, 0.2)", transition: "all 0.2s ease" },
    subtitle: { color: "#6c757d", fontStyle: "italic", marginTop: "10px", marginBottom: "20px" },
    gridContainer: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginTop: "10px" },
    vehicleCard: { backgroundColor: "white", border: "2px solid #ccc", borderRadius: "12px", padding: "20px", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px" },
    cardTitle: { margin: "0 0 10px 0", fontSize: "22px", color: "#333" },
    cardBody: { fontSize: "15px", color: "#555", lineHeight: "1.6" },
    statusBadge: { padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "14px", display: "inline-block", textAlign: "center" },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "480px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "15px" },
    modalContentRelative: { position: "relative", backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "480px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "15px", overflow: "hidden" },
    deleteOverlayInside: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10, padding: "20px" },
    deleteConfirmCard: { backgroundColor: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #eaeaea", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
    warningIcon: { fontSize: "36px", marginBottom: "8px" },
    cancelDeleteButton: { padding: "10px 20px", backgroundColor: "#e2e3e5", color: "#383d41", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
    confirmDeleteButton: { padding: "10px 20px", backgroundColor: "#d32f2f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", boxShadow: "0 2px 4px rgba(211, 47, 47, 0.2)" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "5px" },
    closeModalButton: { border: "none", backgroundColor: "transparent", fontSize: "18px", cursor: "pointer", color: "#888" },
    form: { display: "flex", flexDirection: "column", gap: "14px" },
    input: { padding: "11px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", fontFamily: "Arial, sans-serif" },
    label: { fontSize: "14px", fontWeight: "bold", color: "#555", marginBottom: "-5px" },
    readOnlyField: { padding: "11px 0", fontSize: "16px", color: "#333", borderBottom: "1px dashed #eee", marginTop: "-2px" },
    modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
    changeDetailsButton: { padding: "10px 18px", backgroundColor: "white", color: "#2a5298", border: "1px solid #2a5298", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginRight: "auto" },
    deleteButton: { padding: "10px 18px", backgroundColor: "#fff5f5", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginRight: "auto", transition: "all 0.2s" },
    cancelButton: { padding: "10px 18px", backgroundColor: "#e2e3e5", color: "#383d41", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    saveButton: { padding: "10px 18px", backgroundColor: "#2a5298", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
};

export default Vehicles;