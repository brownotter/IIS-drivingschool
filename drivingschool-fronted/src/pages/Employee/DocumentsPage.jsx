import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAllDocuments, searchDocuments } from "../../services/documentService";

function DocumentsPage() {
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        handleSearch();
    }, [title, documentType, status]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            if (!title && !documentType && !status) {
                const data = await getAllDocuments();
                setDocuments(data);
            } else {
                const data = await searchDocuments(title, status, documentType);
                setDocuments(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setTitle("");
        setDocumentType("");
        setStatus("");
    };

    const logout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            method: "GET",
            credentials: "include"
        });
        localStorage.clear();
        navigate("/");
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

    const formatStatus = (status) => {
        switch (status) {
            case "ACTIVE": return { label: "Active", color: "#155724", bg: "#d4edda" };
            case "EXPIRED": return { label: "Expired", color: "#721c24", bg: "#f8d7da" };
            case "EXPIRING_SOON": return { label: "Expiring soon", color: "#856404", bg: "#fff3cd" };
            case "ARCHIVED": return { label: "Archived", color: "#383d41", bg: "#e2e3e5" };
            default: return { label: status, color: "#333", bg: "#eee" };
        }
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

                <div style={styles.header}>
                    <h1 style={styles.title}>Documents</h1>
                    <button
                        style={styles.addBtn}
                        onClick={() => navigate("/employee/documents/new")}
                    >
                        + Add new
                    </button>
                </div>

                <div style={styles.searchBar}>
                    <input
                        style={styles.searchInput}
                        placeholder="Search by document name..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <select
                        style={styles.select}
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                    >
                        <option value="">All types</option>
                        <option value="MEDICALEXAM">Medical exam</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="CERTIFICATE">Certificate</option>
                        <option value="EXAMRESULT">Exam result</option>
                    </select>

                    <select
                        style={styles.select}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="EXPIRING_SOON">Expiring soon</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>

                    <button style={styles.resetBtn} onClick={handleReset}>
                        Reset
                    </button>
                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Document name</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Created</th>
                                <th style={styles.th}>Modification date</th>
                                <th style={styles.th}>Expiry date</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={styles.emptyMsg}>Loading...</td>
                                </tr>
                            ) : documents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={styles.emptyMsg}>No documents found.</td>
                                </tr>
                            ) : (
                                documents.map((doc, index) => {
                                    const s = formatStatus(doc.docsStatus);
                                    return (
                                        <tr
                                            key={doc.documentsId}
                                            style={{
                                                ...styles.tableRow,
                                                backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9"
                                            }}
                                        >
                                            <td style={styles.td}>{doc.docsTitle}</td>
                                            <td style={styles.td}>{formatType(doc.documentType)}</td>
                                            <td style={styles.td}>{doc.docsCreateDate}</td>
                                            <td style={styles.td}>{doc.docsModfDate || "-"}</td>
                                            <td style={styles.td}>{doc.docsExpireDate || "-"}</td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.badge,
                                                    backgroundColor: s.bg,
                                                    color: s.color
                                                }}>
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.openBtn}
                                                    onClick={() => navigate(`/employee/documents/${doc.documentsId}`)}
                                                >
                                                    Open
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
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
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
    },
    title: {
        color: "#1e3c72",
        fontSize: "28px"
    },
    addBtn: {
        padding: "10px 20px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer"
    },
    searchBar: {
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
        alignItems: "center"
    },
    searchInput: {
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        minWidth: "260px"
    },
    select: {
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        backgroundColor: "white",
        cursor: "pointer"
    },
    resetBtn: {
        padding: "10px 20px",
        backgroundColor: "white",
        color: "#1e3c72",
        border: "1px solid #1e3c72",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        fontWeight: "bold"
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
    badge: {
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold"
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
    emptyMsg: {
        textAlign: "center",
        padding: "40px",
        color: "#888",
        fontSize: "15px"
    }
};

export default DocumentsPage;