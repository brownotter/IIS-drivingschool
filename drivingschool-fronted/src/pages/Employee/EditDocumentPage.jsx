import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getDocumentDetails } from "../../services/documentService";
import {
    updateMedicalExam,
    updateCertificate,
    updateContract,
    updateExamResult
} from "../../services/documentService";

function EditDocumentPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [documentType, setDocumentType] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const [commonFields, setCommonFields] = useState({
        docsTitle: "",
        docsExpireDate: "",
        docsStatus: "ACTIVE",
        changeDescription: "Document updated"
    });

    const [specificFields, setSpecificFields] = useState({});

    useEffect(() => {
        loadDocument();
    }, []);

    const loadDocument = async () => {
        try {
            const data = await getDocumentDetails(id);
            setDocumentType(data.documentType);

            setCommonFields({
                docsTitle: data.docsTitle || "",
                docsExpireDate: data.docsExpireDate || "",
                docsStatus: data.docsStatus || "ACTIVE",
                changeDescription: "Document updated"
            });

            if (data.documentType === "MEDICALEXAM") {
                setSpecificFields({
                    institution: data.institution || "",
                    doctorName: data.doctorName || "",
                    medResult: data.medResult || "",
                    medExamDate: data.medExamDate || ""
                });
            } else if (data.documentType === "CONTRACT") {
                setSpecificFields({
                    contNumb: data.contNumb || "",
                    contStartDate: data.contStartDate || "",
                    ammountCont: data.ammountCont || ""
                });
            } else if (data.documentType === "CERTIFICATE") {
                setSpecificFields({
                    cerfNumb: data.cerfNumb || "",
                    cerfDate: data.cerfDate || "",
                    validDate: data.validDate || ""
                });
            } else if (data.documentType === "EXAMRESULT") {
                setSpecificFields({
                    examType: data.examType || "",
                    examRefNum: data.examRefNum || "",
                    examScore: data.examScore || "",
                    issueDate: data.issueDate || ""
                });
            }

        } catch (err) {
            navigate("/employee/documents");
        } finally {
            setLoading(false);
        }
    };

    const handleCommonChange = (e) => {
        setCommonFields({ ...commonFields, [e.target.name]: e.target.value });
    };

    const handleSpecificChange = (e) => {
        setSpecificFields({ ...specificFields, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!commonFields.docsTitle) {
            setMessage("Please fill in all required fields.");
            return;
        }

        try {
            const payload = { ...commonFields, ...specificFields };

            switch (documentType) {
                case "MEDICALEXAM":
                    await updateMedicalExam(id, payload);
                    break;
                case "CONTRACT":
                    await updateContract(id, payload);
                    break;
                case "CERTIFICATE":
                    await updateCertificate(id, payload);
                    break;
                case "EXAMRESULT":
                    await updateExamResult(id, payload);
                    break;
            }

            setMessage("Document updated successfully!");
            setTimeout(() => navigate(`/employee/documents/${id}`), 1500);

        } catch (err) {
            setMessage("Error updating document. Please try again.");
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

    const formatType = (type) => {
        switch (type) {
            case "MEDICALEXAM": return "Medical exam";
            case "CONTRACT": return "Contract";
            case "CERTIFICATE": return "Certificate";
            case "EXAMRESULT": return "Exam result";
            default: return type;
        }
    };

    const renderSpecificFields = () => {
        switch (documentType) {
            case "MEDICALEXAM":
                return (
                    <>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Institution</label>
                            <input
                                name="institution"
                                value={specificFields.institution || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Doctor name</label>
                            <input
                                name="doctorName"
                                value={specificFields.doctorName || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Result</label>
                            <select
                                name="medResult"
                                value={specificFields.medResult || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            >
                                <option value="" disabled>Select result</option>
                                <option value="FIT">FIT</option>
                                <option value="NOT FIT">NOT FIT</option>
                            </select>
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Exam date</label>
                            <input
                                type="date"
                                name="medExamDate"
                                value={specificFields.medExamDate || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                    </>
                );
            case "CONTRACT":
                return (
                    <>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Contract number</label>
                            <input
                                name="contNumb"
                                value={specificFields.contNumb || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Start date</label>
                            <input
                                type="date"
                                name="contStartDate"
                                value={specificFields.contStartDate || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Amount</label>
                            <input
                                type="number"
                                name="ammountCont"
                                value={specificFields.ammountCont || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                    </>
                );
            case "CERTIFICATE":
                return (
                    <>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Certificate number</label>
                            <input
                                name="cerfNumb"
                                value={specificFields.cerfNumb || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Certificate date</label>
                            <input
                                type="date"
                                name="cerfDate"
                                value={specificFields.cerfDate || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Valid date</label>
                            <input
                                type="date"
                                name="validDate"
                                value={specificFields.validDate || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                    </>
                );
            case "EXAMRESULT":
                return (
                    <>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Exam type</label>
                            <input
                                name="examType"
                                value={specificFields.examType || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Reference number</label>
                            <input
                                name="examRefNum"
                                value={specificFields.examRefNum || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Score</label>
                            <input
                                type="number"
                                name="examScore"
                                value={specificFields.examScore || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Issue date</label>
                            <input
                                type="date"
                                name="issueDate"
                                value={specificFields.issueDate || ""}
                                onChange={handleSpecificChange}
                                style={styles.input}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (loading) return <h2>Loading...</h2>;

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
                    <button style={styles.backBtn} onClick={() => navigate(`/employee/documents/${id}`)}>
                        Back
                    </button>
                    <h1 style={styles.title}>Edit document</h1>
                </div>

                <div style={styles.card}>
                    <div style={styles.row}>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Document type</label>
                            <div style={styles.readOnly}>{formatType(documentType)}</div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Document name</label>
                            <input
                                name="docsTitle"
                                value={commonFields.docsTitle}
                                onChange={handleCommonChange}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Expiry date</label>
                            <input
                                type="date"
                                name="docsExpireDate"
                                value={commonFields.docsExpireDate}
                                onChange={handleCommonChange}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Status</label>
                            <select
                                name="docsStatus"
                                value={commonFields.docsStatus}
                                onChange={handleCommonChange}
                                style={styles.input}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="EXPIRED">Expired</option>
                                <option value="EXPIRING_SOON">Expiring soon</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Edit description</label>
                            <input
                                name="changeDescription"
                                value={commonFields.changeDescription}
                                onChange={handleCommonChange}
                                style={styles.input}
                                placeholder="Document updated"
                            />
                        </div>

                    </div>
                </div>

                <div style={styles.card}>
                    <div style={styles.row}>
                        {renderSpecificFields()}
                    </div>
                </div>

                {message && (
                    <div style={
                        message.includes("successfully")
                            ? styles.successMsg
                            : styles.errorMsg
                    }>
                        {message}
                    </div>
                )}

                <button style={styles.saveBtn} onClick={handleSave}>
                    SAVE
                </button>

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
        marginBottom: "30px"
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
    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        marginBottom: "20px"
    },
    row: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px"
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        minWidth: "180px"
    },
    label: {
        fontSize: "13px",
        color: "#555",
        fontWeight: "bold"
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px"
    },
    readOnly: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        backgroundColor: "#f0f0f0",
        color: "#666"
    },
    saveBtn: {
        marginTop: "10px",
        padding: "14px 48px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "block",
        margin: "0 auto"
    },
    successMsg: {
        padding: "15px",
        backgroundColor: "#d4edda",
        borderRadius: "8px",
        color: "#155724",
        marginBottom: "16px"
    },
    errorMsg: {
        padding: "15px",
        backgroundColor: "#f8d7da",
        borderRadius: "8px",
        color: "#721c24",
        marginBottom: "16px"
    }
};

export default EditDocumentPage;