import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAllArchivedDocuments, unarchiveDocument } from "../../services/documentService";

function ArchivePage() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadArchived();
    }, []);

    const loadArchived = async () => {
        try {
            const data = await getAllArchivedDocuments();
            setDocuments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnarchive = async (documentId) => {
        if (!window.confirm("Are you sure you want to unarchive this document?")) return;
        try {
            await unarchiveDocument(documentId);
            loadArchived();
        } catch (err) {
            console.error(err);
        }
    };

    const formatType = (type) => {
        switch (type) {
            case "MEDICALEXAM": return "Medical exam";
            case "CONTRACT": return "Contract";
            case "CERTIFICATE": return "Certificate";
            case "EXAMRESULT": return "Exam result";
            default: return type;
        }
    };

    const filtered = documents.filter(doc =>
    doc.documentTitle.toLowerCase().includes(search.toLowerCase())
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
                <h1 style={styles.title}>Archive</h1>

                <input
                    style={styles.searchInput}
                    placeholder="Search by document name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Document name</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Candidate</th>
                                <th style={styles.th}>Archived date</th>
                                <th style={styles.th}>Comment</th>
                                <th style={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={styles.emptyMsg}>Loading...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={styles.emptyMsg}>No archived documents found.</td>
                                    </tr>
                                ) : (
                                    filtered.map((doc, index) => (
                                    <tr
                                        key={doc.archiveId}
                                        style={{
                                            ...styles.tableRow,
                                            backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9"
                                        }}
                                    >
                                        <td style={styles.td}>{doc.documentTitle}</td>
                                        <td style={styles.td}>{formatType(doc.documentType)}</td>
                                        <td style={styles.td}>{doc.candidateName}</td>
                                        <td style={styles.td}>{doc.archiveDate}</td>
                                        <td style={styles.td}>{doc.archComment || "-"}</td>
                                        <td style={styles.td}>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    style={styles.openBtn}
                                                    onClick={() => navigate(`/employee/documents/${doc.documentId}`)}
                                                >
                                                    Open
                                                </button>
                                                <button
                                                    style={styles.unarchiveBtn}
                                                    onClick={() => handleUnarchive(doc.documentId)}
                                                >
                                                    Unarchive
                                                </button>
                                            </div>
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
        marginBottom: "24px"
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
    openBtn: {
        padding: "6px 14px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer"
    },
    unarchiveBtn: {
        padding: "6px 14px",
        backgroundColor: "white",
        color: "#1e3c72",
        border: "1px solid #1e3c72",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer"
    },
    emptyMsg: {
        textAlign: "center",
        padding: "40px",
        color: "#888",
        fontSize: "15px"
    },
    searchInput: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minWidth: "260px",
    marginBottom: "24px",
    display: "block"
    }
};

export default ArchivePage;