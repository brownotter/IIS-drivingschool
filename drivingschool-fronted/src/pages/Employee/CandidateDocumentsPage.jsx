import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getDocumentsByCandidate } from "../../services/documentService";
import { getCandidateById } from "../../services/candidateService";

function CandidateDocumentsPage() {
    const navigate = useNavigate();
    const { candidateId } = useParams();

    const [documents, setDocuments] = useState([]);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [docs, cand] = await Promise.all([
                getDocumentsByCandidate(candidateId),
                getCandidateById(candidateId)
            ]);
            setDocuments(docs);
            setCandidate(cand);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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

    const formatStatus = (status) => {
        switch (status) {
            case "ACTIVE": return { label: "Active", color: "#155724", bg: "#d4edda" };
            case "EXPIRED": return { label: "Expired", color: "#721c24", bg: "#f8d7da" };
            case "EXPIRING_SOON": return { label: "Expiring soon", color: "#856404", bg: "#fff3cd" };
            case "ARCHIVED": return { label: "Archived", color: "#383d41", bg: "#e2e3e5" };
            default: return { label: status, color: "#333", bg: "#eee" };
        }
    };

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

                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate("/employee/candidates")}>
                        ← Back
                    </button>
                    <h1 style={styles.title}>
                        {candidate ? `${candidate.firstName} ${candidate.lastName} — Documents` : "Documents"}
                    </h1>
                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Document name</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Created</th>
                                <th style={styles.th}>Expiry date</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={styles.emptyMsg}>Loading...</td>
                                </tr>
                            ) : documents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={styles.emptyMsg}>No documents found.</td>
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
        alignItems: "center",
        gap: "20px",
        marginBottom: "24px"
    },
    backBtn: {
        padding: "8px 16px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#1e3c72",
        color: "white",
        cursor: "pointer",
        fontSize: "14px"
    },
    title: {
        color: "#1e3c72",
        fontSize: "24px"
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

export default CandidateDocumentsPage;