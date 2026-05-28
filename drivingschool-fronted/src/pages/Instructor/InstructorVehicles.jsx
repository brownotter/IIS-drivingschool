import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function InstructorVehicles() {
    const [vehicles, setVehicles] = useState([]);
    
    const [selectedVehicle, setSelectedVehicle] = useState(null);
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
            .catch((error) => console.error("Error fetching vehicles:", error));
    };

    useEffect(() => {
        fetchVehiclesFromBackend();
    }, []);

    const handleStatusChange = (newStatus) => {
        if (!selectedVehicle) return;
        setSelectedVehicle({ ...selectedVehicle, status: newStatus });
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        setErrorMessage(""); 
        
        const originalVehicle = vehicles.find(v => v.id === selectedVehicle.id);

        if (originalVehicle && originalVehicle.status !== selectedVehicle.status) {
            fetch(`http://localhost:8080/vehicle/${selectedVehicle.id}/status?status=${selectedVehicle.status}`, {
                method: "PATCH",
                credentials: "include"
            })
                .then(async (response) => {
                    if (response.ok) {
                        finalizeUpdate();
                    } else {
                        const errorData = await response.json().catch(() => ({ message: "Failed to update status." }));
                        setErrorMessage(errorData.message || `Error: ${response.status}`);
                    }
                })
                .catch(() => {
                    setErrorMessage("Network error. Please try again later.");
                });
        } else {
            finalizeUpdate();
        }
    };

    const finalizeUpdate = () => {
        fetchVehiclesFromBackend();
        setSelectedVehicle(null);
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
                    <h1>Vehicles</h1>
                </div>
                
                <p style={styles.subtitle}>Click on a vehicle to view details or update its status</p>

                <div style={{ display: "flex", gap: "20px", marginBottom: "25px", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>Filter by Category:</label>
                        <select 
                            value={categoryFilter} 
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={styles.filterSelect}
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
                            style={styles.filterSelect}
                        >
                            <option value="ALL">All</option>
                            <option value="RUNNING">Running</option>
                            <option value="TECHNICAL_INSPECTION">Technical Inspection</option>
                            <option value="MALFUNCTION">Malfunction</option>
                        </select>
                    </div>
                </div>

                {selectedVehicle && (
                    <div style={styles.modalOverlay} onClick={() => finalizeUpdate()}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            
                            <div style={styles.modalHeader}>
                                <h3>Vehicle Details</h3>
                                <button style={styles.closeModalButton} onClick={() => finalizeUpdate()}>✕</button>
                            </div>

                            {errorMessage && (
                                <div style={styles.errorAlert}>
                                    ⚠️ {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleUpdateStatus} style={styles.form}>
                                <h2 style={{ fontSize: "24px", margin: "5px 0 10px 0", color: "#333", textAlign: "center" }}>
                                    {selectedVehicle.brand} {selectedVehicle.model}
                                </h2>

                                <label style={styles.label}>Category:</label>
                                <div style={styles.readOnlyField}>{selectedVehicle.category}</div>

                                <label style={styles.label}>Registration Plate:</label>
                                <div style={styles.readOnlyField}>{selectedVehicle.registrationPlate}</div>

                                <label style={styles.label}>Manufacture Year:</label>
                                <div style={styles.readOnlyField}>{selectedVehicle.manufactureYear}</div>

                                <label style={styles.label}>Change Status:</label>
                                <select 
                                    style={styles.input} 
                                    value={selectedVehicle.status} 
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={selectedVehicle.status === "ARCHIVED"}
                                >
                                    <option value="RUNNING">Running</option>
                                    <option value="TECHNICAL_INSPECTION">Technical Inspection</option>
                                    <option value="MALFUNCTION">Malfunction</option>
                                    {selectedVehicle.status === "ARCHIVED" && (<option value="ARCHIVED">Archived</option>)}
                                </select>

                                <div style={styles.modalActions}>
                                    <button type="button" style={styles.cancelButton} onClick={() => finalizeUpdate()}>Cancel</button>
                                    <button type="submit" style={styles.saveButton}>Save Status</button>
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
    subtitle: { color: "#6c757d", fontStyle: "italic", marginTop: "10px", marginBottom: "20px" },
    filterSelect: { padding: "10px 20px 10px 15px", borderRadius: "8px", border: "2px solid #2a5298", backgroundColor: "white", fontWeight: "bold", color: "#2a5298", cursor: "pointer", fontSize: "14px", outline: "none", minWidth: "150px" },
    gridContainer: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginTop: "10px" },
    vehicleCard: { backgroundColor: "white", border: "2px solid #ccc", borderRadius: "12px", padding: "20px", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px" },
    cardTitle: { margin: "0 0 10px 0", fontSize: "22px", color: "#333" },
    cardBody: { fontSize: "15px", color: "#555", lineHeight: "1.6" },
    statusBadge: { padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "14px", display: "inline-block", textAlign: "center" },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "480px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "15px" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "5px" },
    closeModalButton: { border: "none", backgroundColor: "transparent", fontSize: "18px", cursor: "pointer", color: "#888" },
    form: { display: "flex", flexDirection: "column", gap: "14px" },
    input: { padding: "11px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", fontFamily: "Arial, sans-serif" },
    label: { fontSize: "14px", fontWeight: "bold", color: "#555", marginBottom: "-5px" },
    readOnlyField: { padding: "11px 5px", fontSize: "16px", color: "#333", borderBottom: "1px dashed #eee", marginTop: "-2px", fontWeight: "500" },
    modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
    cancelButton: { padding: "10px 18px", backgroundColor: "#e2e3e5", color: "#383d41", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    saveButton: { padding: "10px 18px", backgroundColor: "#2a5298", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    errorAlert: { color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px', marginBottom: '5px', border: '1px solid #d32f2f', fontWeight: 'bold', fontSize: '14px' }
};

export default InstructorVehicles;