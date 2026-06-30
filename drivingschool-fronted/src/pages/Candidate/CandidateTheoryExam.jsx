import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import jsPDF from "jspdf";

function CandidateTheoryExam() {
    const navigate = useNavigate();

    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startingExam, setStartingExam] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/theory-tests/final-exams/progress", {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load final exam progress.");
                }
                return response.json();
            })
            .then((data) => {
                setProgress(data);
            })
            .catch((error) => {
                console.error("Error loading final exam progress:", error);
                setErrorMessage("Failed to load theory final exam progress.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const logout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            method: "GET",
            credentials: "include"
        });

        localStorage.clear();
        navigate("/");
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "Not submitted";
        }

        return new Date(dateValue).toLocaleString();
    };

    const startFinalExam = async () => {
        try {
            setStartingExam(true);
            setErrorMessage("");

            const response = await fetch(
                "http://localhost:8080/api/theory-tests/final-exam/start",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                if (errorText.includes("already passed")) {
                    throw new Error("You have already passed the final exam.");
                }

                throw new Error("You cannot start the final exam. Make sure you attended all 40 theory classes and have a valid medical examination.");
            }

            const test = await response.json();

            navigate(`/candidate/theory-exam/start-test/${test.theoryTestId}`);

        } catch (error) {
            console.error("Error starting final exam:", error);
            setErrorMessage(error.message);
        } finally {
            setStartingExam(false);
        }
    };

    const generatePdfReport = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/theory-tests/report",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to generate report.");
            }

            const report = await response.json();
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Candidate Theory Report", 20, 20);
            doc.setFontSize(12);
            doc.text(`Candidate: ${report.candidateName}`, 20, 40);
            doc.text(`Theory classes attended: ${report.theoryClassesCount}/40`, 20, 50);
            doc.text(`Simulation tests completed: ${report.simulationTestsCompleted}`, 20, 60);
            doc.text(`Average simulation score: ${report.averageSimulationScore}`, 20, 70);
            doc.text(`Final exam attempts: ${report.finalExamAttempts}`, 20, 80);
            doc.text(`Best final exam score: ${report.bestFinalExamScore}/100`, 20, 90);
            doc.text(`Final exam status: ${report.finalExamPassed ? "Passed" : "Not passed"}`,20,100);

            doc.save("candidate-theory-report.pdf");
          

        } catch (error) {
            console.error("Error generating PDF report:", error);
            setErrorMessage("Failed to generate PDF report.");
        }
    };

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    { label: "My Profile", onClick: () => navigate("/candidate") },
                    { label: "Financials", onClick: () => navigate("/candidate/financials") },
                    { label: "Schedule", onClick: () => navigate("/candidate/theory-schedule") },
                    { label: "Notifications", onClick: () => navigate("/candidate/notifications") },
                    { label: "Theory simulation", onClick: () => navigate("/candidate/theory-simulation") },
                    { label: "Theory exam", onClick: () => navigate("/candidate/theory-exam") },
                    { label: "Reports", onClick: () => navigate("/candidate/reports") },
                ]}
                logout={logout}
            />

            <div style={styles.main}>
                <h1 style={styles.title}>Theory Exam Progress</h1>

                {loading && (
                    <div style={styles.contentBox}>
                        <div style={styles.card}>
                            <p>Loading...</p>
                        </div>
                    </div>
                )}

                {!loading && errorMessage && (
                    <div style={styles.errorCard}>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {!loading && progress && (
                    <div style={styles.contentBox}>
                        <div style={styles.statsGrid}>
                            <div style={styles.card}>
                                <p style={styles.cardText}>
                                    <b>Theory Classes Attended:</b>{" "}
                                    {progress.theoryClassesCount ?? 0}/40
                                </p>
                            </div>

                            <div style={styles.card}>
                                <p style={styles.cardText}>
                                    <b>Final Exam Attempts:</b>{" "}
                                    {progress.theoryAttemptsCount ?? 0}
                                </p>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h3 style={styles.subtitle}>Final Exam Attempts</h3>

                            {progress.attempts && progress.attempts.length > 0 ? (
                                <div style={styles.tableWrapper}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>#</th>
                                                <th style={styles.th}>Submitted At</th>
                                                <th style={styles.th}>Score</th>
                                                <th style={styles.th}>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {progress.attempts.map((attempt, index) => (
                                                <tr key={attempt.theoryTestId}>
                                                    <td style={styles.td}>{index + 1}</td>
                                                    <td style={styles.td}>
                                                        {formatDate(attempt.submittedAt)}
                                                    </td>
                                                    <td style={styles.td}>
                                                        {attempt.score ?? 0}/100
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span
                                                            style={
                                                                attempt.passed
                                                                    ? styles.passedBadge
                                                                    : styles.failedBadge
                                                            }
                                                        >
                                                            {attempt.passed
                                                                ? "Passed"
                                                                : "Failed"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={styles.emptyText}>
                                    No final exam attempts found.
                                </p>
                            )}
                        </div>

                        <h1 style={styles.title}>Start your final exam</h1>

                        <div style={styles.buttonContainer}>
                            <button
                                style={styles.startButton}
                                onClick={startFinalExam}
                                disabled={startingExam}
                            >
                                {startingExam ? "STARTING..." : "START FINAL EXAM"}
                            </button>
                        </div>

                         <div style={styles.buttonContainer}>
                            <button
                                style={styles.reportButton}
                                onClick={generatePdfReport}
                            >
                                GENERATE PDF REPORT
                            </button>
                        </div>
                        
                    </div>
                )}
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
        textAlign: "center",
        color: "#1e3c72",
        marginBottom: "25px"
    },

    contentBox: {
        maxWidth: "850px",
        margin: "0 auto"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "20px"
    },

    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: "20px"
    },

    errorCard: {
        backgroundColor: "#ffecec",
        color: "#b00020",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        maxWidth: "850px",
        margin: "0 auto 20px auto"
    },

    cardText: {
        margin: 0,
        color: "#333",
        fontSize: "16px"
    },

    subtitle: {
        marginTop: 0,
        marginBottom: "15px",
        color: "#1e3c72"
    },

    emptyText: {
        color: "gray",
        margin: 0
    },

    tableWrapper: {
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        textAlign: "left",
        padding: "12px",
        borderBottom: "2px solid #ddd",
        color: "#1e3c72"
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #eee",
        color: "#333"
    },

    passedBadge: {
        backgroundColor: "#ecfff0",
        color: "#2e7d32",
        padding: "6px 12px",
        borderRadius: "20px",
        fontWeight: "bold",
        border: "1px solid #5cb85c"
    },

    failedBadge: {
        backgroundColor: "#fff0f0",
        color: "#b00020",
        padding: "6px 12px",
        borderRadius: "20px",
        fontWeight: "bold",
        border: "1px solid #d9534f"
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px"
    },

    startButton: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "12px 30px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
    },

    reportButton: {
        backgroundColor: "white",
        color: "#1e3c72",
        border: "2px solid #1e3c72",
        borderRadius: "8px",
        padding: "12px 30px",
        cursor: "pointer",
        fontSize: "14px"
    }

};

export default CandidateTheoryExam;