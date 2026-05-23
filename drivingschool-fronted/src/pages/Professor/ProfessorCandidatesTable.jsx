import { useEffect, useState } from "react";

function ProfessorCandidatesTable() {
    const [allCandidates, setAllCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [category, setCategory] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/candidate/all", {
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {
                setAllCandidates(data);
            })
            .catch((error) => console.log("Error loading candidates:", error));
    }, []);

    useEffect(() => {
        const result = allCandidates.filter((candidate) => {
            const matchesStatus = candidate.status === "THEORY";
            const matchesCategory = category === "" || candidate.category === category;
            return matchesStatus && matchesCategory;
        });
        setFilteredCandidates(result);
    }, [category, allCandidates]);

    return (
        <div style={{ marginTop: "40px" }}>
            <h2 style={{ color: "#1e3c72", marginBottom: "20px" }}>Candidates</h2>

            <div style={styles.filters}>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.select}
                >
                    <option value="">Filter by category</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                </select>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={styles.th}>First Name</th>
                        <th style={styles.th}>Last Name</th>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate) => (
                            <tr key={candidate.id} style={styles.row}>
                                <td style={styles.td}>{candidate.firstName}</td>
                                <td style={styles.td}>{candidate.lastName}</td>
                                <td style={styles.td}>{candidate.category}</td>
                                <td style={styles.td}>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            backgroundColor: "#fff3cd",
                                            color: "#856404"
                                        }}
                                    >
                                        {candidate.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ ...styles.td, textAlign: "center", color: "#888" }}>
                                No candidates on theory found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    filters: {
        marginBottom: "20px"
    },
    select: {
        padding: "10px 15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "white",
        cursor: "pointer",
        fontSize: "14px"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
    },
    tableHeaderRow: {
        backgroundColor: "#1e3c72"
    },
    th: {
        padding: "16px",
        color: "white",
        textAlign: "left",
        fontSize: "15px"
    },
    td: {
        padding: "16px",
        borderBottom: "1px solid #eee",
        fontSize: "14px"
    },
    statusBadge: {
        padding: "6px 12px",
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "13px"
    },
    row: {
        transition: "0.2s"
    }
};

export default ProfessorCandidatesTable;