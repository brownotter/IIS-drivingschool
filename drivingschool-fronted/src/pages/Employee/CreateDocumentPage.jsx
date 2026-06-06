import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCandidates } from "../../services/candidateService";
import { getEmployeeProfile } from "../../services/employeeService";
import {
    createMedicalExam,
    createCertificate,
    createContract,
    createExamResult
} from "../../services/documentService";
import Sidebar from "../../components/Sidebar";

function CreateDocumentPage() {
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [employeeId, setEmployeeId] = useState(null);
    const [documentType, setDocumentType] = useState("CONTRACT");
    const [message, setMessage] = useState("");

    const [commonFields, setCommonFields] = useState({
        docsTitle: "",
        docsExpireDate: "",
        docsStatus: "ACTIVE"
    });

    const [specificFields, setSpecificFields] = useState({});

    useEffect(() => {
        loadCandidates();
        loadEmployee();
    }, []);

    useEffect(() => {
        setSpecificFields({});
    }, [documentType]);

    const loadCandidates = async () => {
        try {
            const data = await getAllCandidates();
            setCandidates(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadEmployee = async () => {
        try {
            const data = await getEmployeeProfile();
            setEmployeeId(data.id);
        } catch (err) {
            navigate("/");
        }
    };

    const handleCommonChange = (e) => {
        setCommonFields({ ...commonFields, [e.target.name]: e.target.value });
    };

    const handleSpecificChange = (e) => {
        setSpecificFields({ ...specificFields, [e.target.name]: e.target.value });
    };

    const handleCandidateSelect = (e) => {
        const candidate = candidates.find(c => c.id === parseInt(e.target.value));
        setSelectedCandidate(candidate);
    };


    const handleSave = async () => {
        if (!selectedCandidate) {
            setMessage("Please select a candidate.");
            return;
        }

        if (!commonFields.docsTitle || !commonFields.docsExpireDate) {
            setMessage("Please fill in all required fields.");
            return;
        }

        const requiredSpecific = {
            CONTRACT: ["contNumb", "contStartDate", "ammountCont"],
            MEDICALEXAM: ["institution", "doctorName", "medResult", "medExamDate"],
            CERTIFICATE: ["cerfNumb", "cerfDate", "validDate"],
            EXAMRESULT: ["examType", "examRefNum", "examScore", "issueDate"]
        };

        const missing = requiredSpecific[documentType].some(
            field => !specificFields[field]
        );

        if (missing) {
            setMessage("Please fill in all required fields.");
            return;
        }

        try {
            const payload = { ...commonFields, ...specificFields };

            switch (documentType) {
                case "CONTRACT":
                    await createContract(selectedCandidate.id, employeeId, payload);
                    break;
                case "MEDICALEXAM":
                    await createMedicalExam(selectedCandidate.id, employeeId, payload);
                    break;
                case "CERTIFICATE":
                    await createCertificate(selectedCandidate.id, employeeId, payload);
                    break;
                case "EXAMRESULT":
                    await createExamResult(selectedCandidate.id, employeeId, payload);
                    break;
            }

            setMessage("Document created successfully!");
            setTimeout(() => navigate("/employee/documents"), 1500);

        } catch (err) {
            setMessage("Error creating document. Please try again.");
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

    const renderSpecificFields = () => {
        switch (documentType) {
            case "CONTRACT":
                return (
                    <div style={styles.specificBox}>
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
                    </div>
                );
            case "MEDICALEXAM":
                return (
                    <div style={styles.specificBox}>
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
                                style={styles.select}
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
                    </div>
                );
            case "CERTIFICATE":
                return (
                    <div style={styles.specificBox}>
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
                    </div>
                );
            case "EXAMRESULT":
                return (
                    <div style={styles.specificBox}>
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
                    </div>
                );
            default:
                return null;
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
                    <button style={styles.backBtn} onClick={() => navigate(-1)}>Back</button>
                    <h1 style={styles.title}>Create new document</h1>
                </div>

                <div style={styles.card}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Candidate</label>
                        <select style={styles.select} onChange={handleCandidateSelect} defaultValue="">
                            <option value="" disabled>Select candidate</option>
                            {candidates.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.firstName} {c.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCandidate && (
                        <div style={styles.candidateInfo}>
                            <span><b>Candidate:</b> {selectedCandidate.firstName} {selectedCandidate.lastName}</span>
                            <span><b>Category:</b> {selectedCandidate.category}</span>
                        </div>
                    )}
                </div>

                <div style={styles.card}>
                    <div style={styles.row}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Document type</label>
                            <select
                                style={styles.select}
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                            >
                                <option value="CONTRACT">Contract</option>
                                <option value="MEDICALEXAM">Medical exam</option>
                                <option value="CERTIFICATE">Certificate</option>
                                <option value="EXAMRESULT">Exam result</option>
                            </select>
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
                    </div>
                </div>

                {renderSpecificFields()}

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
    specificBox: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px"
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
    select: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        backgroundColor: "white"
    },
    candidateInfo: {
        display: "flex",
        gap: "30px",
        marginTop: "16px",
        fontSize: "14px",
        color: "#333"
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

export default CreateDocumentPage;