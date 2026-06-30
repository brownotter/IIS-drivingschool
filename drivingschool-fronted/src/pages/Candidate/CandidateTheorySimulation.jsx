import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { jsPDF } from "jspdf";

function CandidateTheorySimulation() {
    const navigate = useNavigate();

    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

            fetch(
            "http://localhost:8080/api/theory-tests/simulations/progress",
            {
                method: "GET",
                credentials: "include"
            }
        )
            .then((response) => response.json())
            .then((data) => {
                setProgress(data);
            })
            .catch((error) => {
                console.error("Error loading simulation progress:", error);
                setErrorMessage("Failed to load theory simulation progress.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const startSimulation = async () => {
        try {
            setErrorMessage("");

            const response = await fetch(
                "http://localhost:8080/api/theory-tests/simulation/start",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                if (errorText.includes("already passed")) {
                    throw new Error(
                        "You have already passed the final exam. Simulation tests are no longer available."
                    );
                }

                throw new Error("Failed to start simulation.");
            }

            const test = await response.json();

            navigate(`/candidate/theory-simulation/start-test/${test.theoryTestId}`);

        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
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
                doc.text(
                    `Final exam status: ${report.finalExamPassed ? "Passed" : "Not passed"}`,
                    20,
                    100
                );
    
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
                <h1 style={styles.title}>Theory Progress</h1>

                {loading && (
                    <div style={styles.card}>
                        <p>Loading...</p>
                    </div>
                )}

                {!loading && errorMessage && (
                    <div style={styles.errorCard}>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {!loading && !errorMessage && progress && (
                    <div style={styles.contentBox}>
                        <div style={styles.card}>
                            <p style={styles.cardText}>
                                <b>Theory Classes Attended:</b>{" "}
                                {progress.theoryClassesCount ?? 0}/40
                            </p>
                            
                        </div>

                        <div style={styles.card}>
                            <p style={styles.cardText}>
                                <b>Simulation Tests Completed:</b>{" "}
                                {progress.theorySimulationsCount ?? 0}
                            </p>
                        </div>

                        <div style={styles.card}>
                            <p style={styles.cardText}>
                                <b>Average Simulation Score:</b>{" "}
                                {progress.averageSimulationScore != null
                                    ? progress.averageSimulationScore.toFixed(2)
                                    : "0.00"}
                            </p>
                        </div>

                        <div style={styles.card}>
                            <h3 style={styles.subtitle}>Domains to Improve</h3>

                            {progress.domainsToImprove &&
                            progress.domainsToImprove.length > 0 ? (
                                <ul style={styles.domainList}>
                                    {progress.domainsToImprove.map((domain) => (
                                        <li
                                            key={domain.domainId}
                                            style={styles.domainItem}
                                        >
                                            {domain.domainName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={styles.emptyText}>
                                    No weak domains detected.
                                </p>
                            )}
                        </div>
                    </div>
                )}
                 <h1 style={styles.title}>Start your simulation test</h1>
                <div style={styles.buttonContainer}>
                    <button
                        style={styles.startButton}
                        onClick={startSimulation}>
                        START SIMULATION TEST
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
        maxWidth: "750px",
        margin: "0 auto"
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
        maxWidth: "750px",
        margin: "0 auto"
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

    domainList: {
        margin: 0,
        paddingLeft: "20px"
    },

    domainItem: {
        marginBottom: "8px",
        color: "#333"
    },

    emptyText: {
        color: "gray",
        margin: 0
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "30px"
    },

    startButton: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "12px 30px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "background-color 0.3s ease"
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

export default CandidateTheorySimulation;