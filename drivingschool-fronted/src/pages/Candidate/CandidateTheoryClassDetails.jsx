import React, { useState } from "react";

function CandidateTheoryClassDetails({
    theoryClass,
    onClose,
    onRefreshSchedule
}) {
    const [showSuccessLeave, setShowSuccessLeave] = useState(false);
    const [showSuccessEnroll, setShowSuccessEnroll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user")) || { id: 1 };
    const candidateId = user.id;

    if (!theoryClass) return null;

    const isEnrolled = theoryClass.status === "ENROLLED";

    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.`;
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";

        const parts = timeString.split(":");

        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
        }

        return timeString;
    };

    const handleAction = () => {
        setLoading(true);
        setErrorMessage("");

        const endpoint = isEnrolled ? "cancel" : "enroll";

        fetch(
            `http://localhost:8080/api/theory-classes/${theoryClass.theoryId}/${endpoint}/${candidateId}`,
            {
                method: "PUT"
            }
        )
            .then(async (res) => {
                if (!res.ok) {
                    let errorMessage = "";

                    try {
                        const errorText = await res.text();

                        try {
                            const errorJson = JSON.parse(errorText);
                            errorMessage = errorJson.message;
                        } catch {
                            errorMessage = errorText;
                        }
                    } catch (e) {
                        errorMessage = "";
                    }

                    if (endpoint === "cancel") {
                        throw new Error(
                            "You cannot leave this class because you have already canceled your attendance too many times."
                        );
                    }

                    throw new Error(errorMessage || `Server error: ${res.status}`);
                }

                setLoading(false);

                if (isEnrolled) {
                    setShowSuccessLeave(true);
                } else {
                    setShowSuccessEnroll(true);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.error("Detailed error on frontend:", err);
                setErrorMessage(err.message);
            });
    };

    const handleFinalOkay = () => {
        setShowSuccessLeave(false);
        setShowSuccessEnroll(false);
        onRefreshSchedule();
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modalBox}>
                <button style={styles.closeButton} onClick={onClose}>
                    ×
                </button>

                <h1 style={styles.title}>Theory Class Details</h1>

                {errorMessage && (
                    <div style={styles.errorCard}>
                        {errorMessage}
                    </div>
                )}

                <div style={styles.detailsContainer}>
                    <div style={styles.row}>
                        <span style={styles.label}>Domain</span>
                        <span style={styles.value}>
                            {theoryClass.domainName || "Signs"}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Date</span>
                        <span style={styles.value}>
                            {formatDate(theoryClass.theoryDate)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Time</span>
                        <span style={styles.value}>
                            {formatTime(theoryClass.theoryStartTime)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Professor</span>
                        <span style={styles.value}>
                            {theoryClass.professorName || "Milan Marić"}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Status</span>
                        <span
                            style={
                                isEnrolled
                                    ? styles.enrolledBadge
                                    : styles.availableBadge
                            }
                        >
                            {theoryClass.status}
                        </span>
                    </div>
                </div>

                <div style={styles.footer}>
                    <p style={styles.promptText}>
                        {isEnrolled
                            ? "Can't come to this class?"
                            : "Want to come to this class?"}
                    </p>

                    <button
                        style={
                            isEnrolled
                                ? styles.leaveButton
                                : styles.actionButton
                        }
                        onClick={handleAction}
                        disabled={loading}
                    >
                        {loading
                            ? "PROCESSING..."
                            : isEnrolled
                                ? "LEAVE CLASS"
                                : "ENROLL IN CLASS"}
                    </button>

                    <button style={styles.backButton} onClick={onClose}>
                        BACK
                    </button>
                </div>

                {showSuccessLeave && (
                    <div style={styles.innerOverlay}>
                        <div style={styles.successBox}>
                            <h2 style={styles.successTitle}>Success</h2>

                            <p style={styles.successText}>
                                You successfully left this class.
                            </p>

                            <p style={styles.successSubText}>
                                Take a look at other available classes in the schedule.
                            </p>

                            <button
                                style={styles.okayButton}
                                onClick={handleFinalOkay}
                            >
                                OKAY
                            </button>
                        </div>
                    </div>
                )}

                {showSuccessEnroll && (
                    <div style={styles.innerOverlay}>
                        <div style={styles.successBox}>
                            <h2 style={styles.successTitle}>Success</h2>

                            <p style={styles.successText}>
                                You successfully enrolled in this class.
                            </p>

                            <p style={styles.successSubText}>
                                See you there!
                            </p>

                            <button
                                style={styles.okayButton}
                                onClick={handleFinalOkay}
                            >
                                OKAY
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
    },

    modalBox: {
        backgroundColor: "white",
        width: "100%",
        maxWidth: "600px",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
        boxSizing: "border-box",
        position: "relative",
        fontFamily: "Arial"
    },

    closeButton: {
        position: "absolute",
        top: "15px",
        right: "18px",
        border: "none",
        backgroundColor: "transparent",
        fontSize: "28px",
        cursor: "pointer",
        color: "#777"
    },

    title: {
        textAlign: "center",
        color: "#1e3c72",
        marginTop: 0,
        marginBottom: "30px",
        fontSize: "30px"
    },

    errorCard: {
        backgroundColor: "#ffecec",
        color: "#b00020",
        border: "1px solid #d9534f",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: "20px"
    },

    detailsContainer: {
        backgroundColor: "#f4f7fb",
        borderRadius: "12px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "30px",
        border: "1px solid #e6e6e6"
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        fontSize: "16px"
    },

    label: {
        color: "#1e3c72",
        fontWeight: "bold",
        minWidth: "110px"
    },

    value: {
        color: "#333",
        flex: 1,
        textAlign: "right"
    },

    enrolledBadge: {
        backgroundColor: "#ecfff0",
        color: "#2e7d32",
        padding: "6px 12px",
        borderRadius: "20px",
        fontWeight: "bold",
        border: "1px solid #5cb85c"
    },

    availableBadge: {
        backgroundColor: "#eaf1fb",
        color: "#1e3c72",
        padding: "6px 12px",
        borderRadius: "20px",
        fontWeight: "bold",
        border: "1px solid #d9e6f7"
    },

    footer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px"
    },

    promptText: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
        margin: 0
    },

    actionButton: {
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        padding: "12px 28px",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "8px",
        minWidth: "180px"
    },

    leaveButton: {
        backgroundColor: "#b00020",
        color: "white",
        border: "none",
        padding: "12px 28px",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "8px",
        minWidth: "180px"
    },

    backButton: {
        backgroundColor: "white",
        color: "#1e3c72",
        border: "1px solid #1e3c72",
        padding: "10px 24px",
        fontSize: "14px",
        cursor: "pointer",
        borderRadius: "8px",
        fontWeight: "bold",
        minWidth: "120px"
    },

    innerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        borderRadius: "12px"
    },

    successBox: {
        backgroundColor: "white",
        width: "90%",
        maxWidth: "420px",
        padding: "30px",
        textAlign: "center",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
    },

    successTitle: {
        color: "#2e7d32",
        margin: 0,
        fontSize: "26px"
    },

    successText: {
        fontSize: "16px",
        margin: "5px 0",
        color: "#333",
        fontWeight: "bold"
    },

    successSubText: {
        fontSize: "14px",
        margin: "0",
        color: "#555"
    },

    okayButton: {
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        padding: "10px 26px",
        fontSize: "14px",
        cursor: "pointer",
        marginTop: "15px",
        borderRadius: "8px",
        fontWeight: "bold"
    }
};

export default CandidateTheoryClassDetails;