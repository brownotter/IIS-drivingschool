import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAllCandidates } from "../../services/candidateService";

function CandidatesPage() {
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            const data = await getAllCandidates();
            setCandidates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = candidates.filter(c =>
        `${c.firstName} ${c.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const logout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            method: "GET",
            credentials: "include"
        });
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={styles.container}>

            <Sidebar
                logout={logout}
                buttons={[
                    { label: "Home",       onClick: () => navigate("/employee") },
                    { label: "Documents",  onClick: () => navigate("/employee/documents") },
                    { label: "Candidates", onClick: () => navigate("/employee/candidates") },
                    { label: "Alerts",     onClick: () => navigate("/employee/alerts") },
                    { label: "Archive",    onClick: () => navigate("/employee/archive") },
                    { label: "My Profile", onClick: () => navigate("/employee/profile") },
                ]}
            />

            <div style={styles.main}>

                <h1 style={styles.title}>Candidates</h1>

                <input
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Candidate</th>
                                <th style={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={styles.emptyMsg}>Loading...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={styles.emptyMsg}>No candidates found.</td>
                                </tr>
                            ) : (
                                filtered.map((c, index) => (
                                    <tr
                                        key={c.id}
                                        style={{
                                            ...styles.tableRow,
                                            backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9"
                                        }}
                                    >
                                        <td style={styles.td}>
                                            {c.firstName} {c.lastName}
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.docsBtn}
                                                onClick={() => navigate(`/employee/candidates/${c.id}/documents`)}
                                            >
                                                All documents
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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
    main: {
        flex: 1,
        padding: "40px"
    },
    title: {
        color: "#1e3c72",
        fontSize: "28px",
        textAlign: "center",
        marginBottom: "24px"
    },
    searchInput: {
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        minWidth: "260px",
        marginBottom: "24px",
        display: "block"
    },
    tableWrapper: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        overflow: "hidden"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse"
    },
    tableHeader: {
        backgroundColor: "#1e3c72"
    },
    th: {
        padding: "14px 16px",
        textAlign: "left",
        color: "white",
        fontSize: "14px",
        fontWeight: "bold"
    },
    tableRow: {
        borderBottom: "1px solid #eee"
    },
    td: {
        padding: "12px 16px",
        fontSize: "14px",
        color: "#333"
    },
    docsBtn: {
        padding: "6px 14px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer"
    },
    emptyMsg: {
        textAlign: "center",
        padding: "40px",
        color: "#888",
        fontSize: "15px"
    }
};

export default CandidatesPage;