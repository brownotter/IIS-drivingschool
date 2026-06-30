import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Professors() {
    const navigate = useNavigate();

    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const response = await fetch("http://localhost:8080/user/professors");

                if (!response.ok) {
                    throw new Error("Failed to load professors.");
                }

                const data = await response.json();
                setProfessors(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching professors:", error);
                setErrorMessage("Failed to load professors.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfessors();
    }, []);

    const filteredProfessors = professors.filter((professor) =>
        `${professor.firstName || ""} ${professor.lastName || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

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
                <div style={styles.mainCard}>
                    <h1 style={styles.title}>Professors</h1>

                    {loading && (
                        <div style={styles.infoCard}>
                            Loading professors...
                        </div>
                    )}

                    {!loading && errorMessage && (
                        <div style={styles.errorCard}>
                            {errorMessage}
                        </div>
                    )}

                    {!loading && !errorMessage && (
                        <>
                            <div style={styles.summaryCard}>
                                <p style={styles.summaryText}>
                                    <b>Total professors:</b> {professors.length}
                                </p>
                            </div>

                            <div style={styles.searchContainer}>
                                <span style={styles.searchIcon}>🔍</span>

                                <input
                                    type="text"
                                    placeholder="Search by first or last name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>

                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>First Name</th>
                                            <th style={styles.th}>Last Name</th>
                                            <th style={styles.th}>Username</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Contact</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredProfessors.map((professor) => (
                                            <tr key={professor.id} style={styles.tr}>
                                                <td style={styles.td}>
                                                    {professor.firstName || "—"}
                                                </td>

                                                <td style={styles.td}>
                                                    {professor.lastName || "—"}
                                                </td>

                                                <td style={styles.td}>
                                                    {professor.username || "—"}
                                                </td>

                                                <td style={styles.td}>
                                                    {professor.email || "—"}
                                                </td>

                                                <td style={styles.td}>
                                                    {professor.contact || "—"}
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredProfessors.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={styles.noDataTd}>
                                                    No professors match your search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
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

    mainCard: {
        width: "100%",
        maxWidth: "1000px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        padding: "40px",
        boxSizing: "border-box"
    },

    title: {
        textAlign: "center",
        color: "#1e3c72",
        marginTop: 0,
        marginBottom: "30px",
        fontSize: "32px"
    },

    infoCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        color: "#333",
        textAlign: "center"
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

    summaryCard: {
        backgroundColor: "#f4f7fb",
        padding: "18px",
        borderRadius: "10px",
        marginBottom: "20px",
        border: "1px solid #e6e6e6"
    },

    summaryText: {
        margin: 0,
        color: "#333",
        fontSize: "15px",
        justifyContent: "flex-start"
    },

   searchContainer: {
        display: "flex",
        alignItems: "center",
        width: "320px",
        border: "1px solid #d9d9d9",
        borderRadius: "20px",
        backgroundColor: "white",
        padding: "0 12px",
        boxSizing: "border-box"
    },

    searchIcon: {
        fontSize: "15px",
        color: "#777",
        marginRight: "8px"
    },

    searchInput: {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "10px 0",
        fontSize: "14px",
        backgroundColor: "transparent"
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto",
        borderRadius: "12px",
        border: "1px solid #e6e6e6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        marginTop: "20px"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
        fontSize: "14px",
        backgroundColor: "white"
    },

    th: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "14px 15px",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.5px"
    },

    tr: {
        borderBottom: "1px solid #e6e6e6"
    },

    td: {
        padding: "14px 15px",
        color: "#333",
        verticalAlign: "middle"
    },

    noDataTd: {
        padding: "30px",
        textAlign: "center",
        color: "gray",
        fontSize: "15px"
    }
};

export default Professors;