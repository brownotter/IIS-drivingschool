import React, { useState } from "react";

function CandidateTheoryClassDetails({ theoryClass, onClose, onRefreshSchedule }) {
    const [showSuccessLeave, setShowSuccessLeave] = useState(false);
    const [showSuccessEnroll, setShowSuccessEnroll] = useState(false);
    const [loading, setLoading] = useState(false);

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
            const hour = parseInt(parts[0], 10);
            const minute = parts[1];
            const ampm = hour >= 12 ? "PM" : "AM";
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${displayHour}:${minute} ${ampm}`;
        }
        return timeString;
    };

    const handleAction = () => {
        setLoading(true);
        const endpoint = isEnrolled ? "cancel" : "enroll";
        
        console.log(`Šaljem zahtev na: http://localhost:8080/api/theory-classes/${theoryClass.theoryId}/${endpoint}/${candidateId}`);

        fetch(`http://localhost:8080/api/theory-classes/${theoryClass.theoryId}/${endpoint}/${candidateId}`, {
            method: "PUT"
        })
        .then(async (res) => {
            if (!res.ok) {
                let errorMessage = "";
                try {
                    errorMessage = await res.text();
                } catch (e) {
                    errorMessage = "";
                }

                if (endpoint === "cancel") {
                    throw new Error("You cannot leave this class because you have already canceled your attendance certain amount of times.");
                } else {
                    throw new Error(errorMessage || `Server error: ${res.status}`);
                }
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
            alert(err.message);
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
                
                <h1 style={styles.title}>Theory Class Details</h1>
                
                <div style={styles.detailsContainer}>
                    <div style={styles.row}>
                        <span style={styles.label}>Domain:</span>
                        <span style={styles.value}>{theoryClass.domainName || "Signs"}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Date:</span>
                        <span style={styles.value}>{formatDate(theoryClass.theoryDate)}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Time:</span>
                        <span style={styles.value}>{formatTime(theoryClass.theoryStartTime)}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Professor:</span>
                        <span style={styles.value}>{theoryClass.professorName || "Milan Marić"}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Status:</span>
                        <span style={{ 
                            ...styles.value, 
                            color: isEnrolled ? "#28a745" : "#00bcd4",
                            fontWeight: "bold" 
                        }}>
                            {theoryClass.status}
                        </span>
                    </div>
                </div>

                <div style={styles.footer}>
                    <div style={styles.promptText}>
                        {isEnrolled ? "Can't come to this class?" : "Want to come to this class?"}
                    </div>
                    
                    <button 
                        style={styles.actionButton} 
                        onClick={handleAction}
                        disabled={loading}
                    >
                        {isEnrolled ? "LEAVE CLASS" : "ENROLL IN CLASS"}
                    </button>
                </div>

                <div style={styles.backWrapper}>
                    <button style={styles.backButton} onClick={onClose}>BACK</button>
                </div>

                {showSuccessLeave && (
                    <div style={styles.innerOverlay}>
                        <div style={styles.successBox}>
                            <p style={styles.successTextItalic}>You successfully left this class.</p>
                            <p style={styles.successTextItalic}>Take a look at other available classes in the schedule.</p>
                            <button style={styles.okayButton} onClick={handleFinalOkay}>OKAY</button>
                        </div>
                    </div>
                )}

                {showSuccessEnroll && (
                    <div style={styles.innerOverlay}>
                        <div style={styles.successBox}>
                            <p style={styles.successTextItalic}>You successfully enrolled in this class.</p>
                            <p style={styles.successTextItalic}>See you there!</p>
                            <button style={styles.okayButton} onClick={handleFinalOkay}>OKAY</button>
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
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
    },
    modalBox: {
        backgroundColor: "#ffffff",
        border: "3px solid #333333",
        width: "100%",
        maxWidth: "600px",
        padding: "40px",
        boxSizing: "border-box",
        position: "relative",
        fontFamily: '"Arial", sans-serif'
    },
    title: {
        fontSize: "32px",
        textAlign: "center",
        textDecoration: "underline",
        fontWeight: "normal",
        marginBottom: "40px",
        marginTop: "0"
    },
    detailsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "400px",
        margin: "0 auto 40px auto"
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "18px"
    },
    label: {
        color: "#333",
        width: "120px"
    },
    value: {
        color: "#000",
        flex: 1,
        textAlign: "left",
        paddingLeft: "20px"
    },
    footer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "450px",
        margin: "0 auto 30px auto",
        gap: "10px"
    },
    promptText: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#222"
    },
    actionButton: {
        backgroundColor: "#9cc2cb",
        border: "2px solid #333333",
        padding: "12px 24px",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "500",
        boxShadow: "2px 2px 0px #333333",
        borderRadius: "4px"
    },
    backWrapper: {
        display: "flex",
        justifyContent: "center"
    },
    backButton: {
        backgroundColor: "#9cc2cb",
        border: "2px solid #333333",
        padding: "6px 20px",
        fontSize: "14px",
        cursor: "pointer",
        boxShadow: "1px 1px 0px #333333",
        borderRadius: "4px"
    },
    innerOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
    },
    successBox: {
        backgroundColor: "#ffffff",
        border: "2px solid #333333",
        width: "90%",
        maxWidth: "420px",
        padding: "30px",
        textAlign: "center",
        boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
    },
    successTextItalic: {
        fontSize: "16px",
        fontStyle: "italic",
        margin: "5px 0",
        color: "#333"
    },
    okayButton: {
        backgroundColor: "#ffffff",
        border: "2px solid #333333",
        padding: "6px 25px",
        fontSize: "14px",
        cursor: "pointer",
        marginTop: "15px",
        borderRadius: "4px",
        fontWeight: "normal"
    }
};

export default CandidateTheoryClassDetails;