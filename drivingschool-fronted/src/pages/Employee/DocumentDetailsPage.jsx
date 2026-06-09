import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getDocumentDetails, getDocumentValidity, getDocumentVersions, restoreDocumentVersion } from "../../services/documentService";

function DocumentDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);

    const [validity, setValidity] = useState(null);

    const [versions, setVersions] = useState([]);
    const [previewVersion, setPreviewVersion] = useState(null);

    useEffect(() => {
        loadDocument();
    }, []);

    const loadDocument = async () => {
        try {
            const data = await getDocumentDetails(id);
            setDoc(data);

            try {
            const validityData = await getDocumentValidity(id);
            setValidity(validityData);
            } catch (err) {
                //ne postoji validy zapis
            }
            try {
            const versionsData = await getDocumentVersions(id);
            setVersions(versionsData);
            } catch (err) {
                //ne postiji verzuje
            }

        } catch (err) {
            navigate("/employee/documents");
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (versionId) => {
    if (!window.confirm("Are you sure you want to restore this version?")) return;
    try {
        await restoreDocumentVersion(id, versionId);
        loadDocument();
    } catch (err) {
        console.error(err);
    }
    };

    const fieldLabels = {
    docsTitle: "Document name",
    docsStatus: "Status",
    docsExpireDate: "Expiry date",
    docsCreateDate: "Created date",
    docsModfDate: "Last modified",
    currentVersion: "Version",
    institution: "Institution",
    doctorName: "Doctor",
    medResult: "Result",
    medExamDate: "Exam date",
    contNumb: "Contract number",
    contStartDate: "Start date",
    ammountCont: "Amount",
    cerfNumb: "Certificate number",
    cerfDate: "Certificate date",
    validDate: "Valid date",
    examType: "Exam type",
    examRefNum: "Reference number",
    examScore: "Score",
    issueDate: "Issue date"
    };

    const hiddenFields = ["documentsId", "documentType"];

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

    const renderSpecificFields = () => {
        if (!doc) return null;
        const type = doc.documentType || doc.class;

        if (doc.institution !== undefined) {
            return (
                <>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Examination date</label>
                        <div style={styles.fieldBox}>{doc.medExamDate || "-"}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Institution</label>
                        <div style={styles.fieldBox}>{doc.institution}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Doctor</label>
                        <div style={styles.fieldBox}>{doc.doctorName}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Result</label>
                        <div style={styles.fieldBox}>{doc.medResult}</div>
                    </div>
                </>
            );
        }

        if (doc.contNumb !== undefined) {
            return (
                <>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Contract number</label>
                        <div style={styles.fieldBox}>{doc.contNumb}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Start date</label>
                        <div style={styles.fieldBox}>{doc.contStartDate}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Amount</label>
                        <div style={styles.fieldBox}>{doc.ammountCont}</div>
                    </div>
                </>
            );
        }

        if (doc.cerfNumb !== undefined) {
            return (
                <>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Certificate number</label>
                        <div style={styles.fieldBox}>{doc.cerfNumb}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Certificate date</label>
                        <div style={styles.fieldBox}>{doc.cerfDate}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Valid date</label>
                        <div style={styles.fieldBox}>{doc.validDate}</div>
                    </div>
                </>
            );
        }

        if (doc.examRefNum !== undefined) {
            return (
                <>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Exam type</label>
                        <div style={styles.fieldBox}>{doc.examType}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Reference number</label>
                        <div style={styles.fieldBox}>{doc.examRefNum}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Score</label>
                        <div style={styles.fieldBox}>{doc.examScore}</div>
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Issue date</label>
                        <div style={styles.fieldBox}>{doc.issueDate}</div>
                    </div>
                </>
            );
        }

        return null;
    };

    if (loading) return <h2>Loading...</h2>;
    if (!doc) return <h2>Document not found.</h2>;

    const s = formatStatus(doc.docsStatus);

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
                    <button style={styles.backBtn} onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <p style={styles.subtitle}>Document details</p>
                </div>

                <h1 style={styles.docTitle}>{doc.docsTitle}</h1>

                <div style={styles.card}>

                    <div style={styles.leftSection}>

                        <div style={styles.row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Document type</label>
                                <div style={styles.fieldBox}>{formatType(doc.documentType)}</div>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Document status</label>
                                <div style={{
                                    ...styles.fieldBox,
                                    backgroundColor: s.bg,
                                    color: s.color,
                                    fontWeight: "bold"
                                }}>
                                    {s.label}
                                </div>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Document version</label>
                                <div style={styles.fieldBox}>V{doc.currentVersion}</div>
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Created date</label>
                                <div style={styles.fieldBox}>{doc.docsCreateDate}</div>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Expiry date</label>
                                <div style={styles.fieldBox}>{doc.docsExpireDate || "-"}</div>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Last modified</label>
                                <div style={styles.fieldBox}>{doc.docsModfDate || "-"}</div>
                            </div>
                        </div>

                        <div style={styles.specificBox}>
                            <div style={styles.row}>
                                {renderSpecificFields()}
                            </div>
                        </div>

                    </div>


                    <div style={styles.actions}>
                        <button style={styles.actionBtn}>Download</button>
                        <button style={styles.actionBtn}>Archive</button>
                        <button
                            style={styles.actionBtn}
                            onClick={() => navigate(`/employee/documents/${id}/edit`)}
                        >
                            Edit
                        </button>
                    </div>

                </div>

                <div style={styles.alertsCard}>
                    <h3 style={styles.alertsTitle}>
                        Alerts 
                    </h3>

                    {validity && (validity.validityStatus === "EXPIRING_SOON" || validity.validityStatus === "EXPIRED") ? (
                        <div style={styles.alertItem}>
                            <span style={{
                                ...styles.alertBadge,
                                color: validity.validityStatus === "EXPIRED" ? "#721c24" : "#856404",
                                backgroundColor: validity.validityStatus === "EXPIRED" ? "#f8d7da" : "#fff3cd"
                            }}>
                                {validity.validityStatus === "EXPIRED"
                                    ? "EXPIRED"
                                    : `EXPIRES IN ${validity.daysUntilExpiry} DAYS`
                                }
                            </span>
                            <span style={styles.alertDate}>
                                Valid until: {validity.validUntil || "-"}
                            </span>
                            <span style={styles.alertDate}>
                                Last check: {validity.lastCheck || "-"}
                            </span>
                        </div>
                    ) : (
                        <p style={styles.noAlerts}>No alerts for this document</p>
                    )}
                </div>

                    <div style={styles.alertsCard}>
                        <h3 style={styles.alertsTitle}>
                            Version history
                        </h3>

                        {versions.length === 0 ? (
                            <p style={styles.noAlerts}>No version history.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto", overflowX: "hidden" }}>
                                {versions.map((v) => (
                                    <div key={v.versionId} style={styles.versionItem}>
                                        <div style={styles.versionBadge}>V{v.versionNum}</div>
                                        <div style={styles.versionInfo}>
                                            <span style={styles.versionDesc}>{v.changeDescription}</span>
                                            <span style={styles.versionMeta}>
                                                {v.changedBy} — {v.changeTime ? v.changeTime.replace("T", " ").substring(0, 16) : "-"}
                                            </span>
                                        </div>
                                        <button
                                            style={styles.restoreBtn}
                                            onClick={() => setPreviewVersion(v)}
                                        >
                                            Preview & Restore
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {previewVersion && previewVersion.snapshotData && (
                            <div style={styles.modalOverlay}>
                                <div style={styles.modal}>
                                    <h3 style={styles.modalTitle}>
                                        Preview — V{previewVersion.versionNum}
                                    </h3>
                                    <p style={styles.modalMeta}>
                                        {previewVersion.changedBy} — {previewVersion.changeTime?.replace("T", " ").substring(0, 16)}
                                    </p>

                                    <div style={styles.modalFields}>
                                        {Object.entries(JSON.parse(previewVersion.snapshotData))
                                            .filter(([key]) => !hiddenFields.includes(key))
                                            .map(([key, value]) => (
                                                <div key={key} style={styles.modalField}>
                                                    <label style={styles.modalLabel}>
                                                        {fieldLabels[key] || key}
                                                    </label>
                                                    <div style={styles.modalValue}>{value?.toString() || "-"}</div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div style={styles.modalButtons}>
                                        <button
                                            style={styles.restoreConfirmBtn}
                                            onClick={() => {
                                                handleRestore(previewVersion.versionId);
                                                setPreviewVersion(null);
                                            }}
                                        >
                                            Restore this version
                                        </button>
                                        <button
                                            style={styles.cancelBtn}
                                            onClick={() => setPreviewVersion(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
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
    main: {
        flex: 1,
        padding: "40px"
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "8px"
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
    subtitle: {
        color: "#888",
        fontSize: "14px",
        fontStyle: "italic"
    },
    docTitle: {
        color: "#1e3c72",
        fontSize: "26px",
        marginBottom: "24px",
        textAlign: "center"
    },
    card: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "40px",
        justifyContent: "space-between"
    },
    leftSection: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },
    row: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        minWidth: "160px"
    },
    label: {
        fontSize: "12px",
        color: "#888"
    },
    fieldBox: {
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        backgroundColor: "#f9f9f9",
        color: "#333"
    },
    specificBox: {
        borderTop: "1px solid #eee",
        paddingTop: "20px"
    },
    actions: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "120px"
    },
    actionBtn: {
        padding: "12px 20px",
        backgroundColor: "white",
        color: "#1e3c72",
        border: "1px solid #1e3c72",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        fontWeight: "bold",
        textAlign: "center"
    },
    alertsCard: {
    backgroundColor: "white",
    padding: "20px 24px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginTop: "20px"
    },
    alertsTitle: {
        fontSize: "15px",
        color: "#1e3c72",
        marginBottom: "12px"
    },
    alertItem: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #eee",
        backgroundColor: "#fafafa"
    },
    alertBadge: {
        fontSize: "13px",
        fontWeight: "bold",
        padding: "4px 10px",
        borderRadius: "20px"
    },
    alertDate: {
        fontSize: "13px",
        color: "#888"
    },
    noAlerts: {
    color: "#888",
    fontSize: "14px",
    padding: "8px 0"
    },
    versionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #eee",
    backgroundColor: "#fafafa"
    },
    versionBadge: {
        padding: "4px 10px",
        backgroundColor: "#1e3c72",
        color: "white",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "bold",
        minWidth: "36px",
        textAlign: "center"
    },
    versionInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px"
    },
    versionDesc: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#333"
    },
    versionMeta: {
        fontSize: "12px",
        color: "#888"
    },
    restoreBtn: {
    marginLeft: "auto",
    padding: "4px 12px",
    backgroundColor: "white",
    color: "#1e3c72",
    border: "1px solid #1e3c72",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer"
    },
    modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
    },
    modal: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "30px",
        width: "500px",
        maxHeight: "80vh",
        overflowY: "auto"
    },
    modalTitle: {
        color: "#1e3c72",
        fontSize: "18px",
        marginBottom: "4px"
    },
    modalMeta: {
        color: "#888",
        fontSize: "13px",
        marginBottom: "20px"
    },
    modalFields: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "24px"
    },
    modalField: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    modalLabel: {
        fontSize: "12px",
        color: "#888"
    },
    modalValue: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        backgroundColor: "#f9f9f9"
    },
    modalButtons: {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end"
    },
    restoreConfirmBtn: {
        padding: "10px 20px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    cancelBtn: {
        padding: "10px 20px",
        backgroundColor: "white",
        color: "#1e3c72",
        border: "1px solid #1e3c72",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer"
    }
    
};

export default DocumentDetailsPage;