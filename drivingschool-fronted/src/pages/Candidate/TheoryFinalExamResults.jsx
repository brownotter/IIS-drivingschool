import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function TheoryFinalExamResults() {
    const navigate = useNavigate();
    const { testId } = useParams();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/api/theory-tests/${testId}/result`, {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load test result.");
                }
                return response.json();
            })
            .then((data) => {
                setResult(data);
            })
            .catch((error) => {
                console.error("Error loading test result:", error);
                setErrorMessage("Failed to load test result.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [testId]);

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
                <h1 style={styles.title}>Theory Final Exam Results</h1>

                {loading && (
                    <div style={styles.contentBox}>
                        <div style={styles.card}>
                            <p>Loading result...</p>
                        </div>
                    </div>
                )}

                {!loading && errorMessage && (
                    <div style={styles.errorCard}>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {!loading && !errorMessage && result && (
                    <div style={styles.contentBox}>
                        <div style={styles.summaryCard}>
                            <h2 style={styles.subtitle}>Test Summary</h2>

                            <p style={styles.cardText}>
                                <b>Score:</b> {result.score}/100
                            </p>

                            <p style={styles.cardText}>
                                <b>Status:</b>{" "}
                                {result.passed ? "Passed" : "Failed"}
                            </p>

                            <p style={styles.cardText}>
                                <b>Correct Answers:</b>{" "}
                                {result.correctAnswers}/{result.totalQuestions}
                            </p>

                            <p style={styles.cardText}>
                                <b>Started At:</b>{" "}
                                {result.startedAt}
                            </p>

                            <p style={styles.cardText}>
                                <b>Submitted At:</b>{" "}
                                {result.submittedAt}
                            </p>

                        </div>


                        <h2 style={styles.sectionTitle}>Question Review</h2>

                        {result.questions &&
                            result.questions.map((question, index) => (
                                <div
                                    key={question.questionId}
                                    style={
                                        question.correct
                                            ? styles.correctQuestionCard
                                            : styles.wrongQuestionCard
                                    }
                                >
                                    <h3 style={styles.questionTitle}>
                                        {index + 1}. {question.questionText}
                                    </h3>

                                    {question.imageUrl && (
                                        <img
                                            src={question.imageUrl}
                                            alt="Question"
                                            style={styles.questionImage}
                                        />
                                    )}

                                    <p style={styles.cardText}>
                                        <b>Your answer:</b>{" "}
                                        {question.selectedAnswerText}
                                    </p>

                                    <p style={styles.cardText}>
                                        <b>Correct answer:</b>{" "}
                                        {question.correctAnswerText}
                                    </p>

                                    <p
                                        style={
                                            question.correct
                                                ? styles.correctText
                                                : styles.wrongText
                                        }
                                    >
                                        {question.correct ? "Correct" : "Incorrect"}
                                    </p>
                                </div>
                            ))}

                        <div style={styles.buttonContainer}>
                            <button
                                style={styles.backButton}
                                onClick={() =>
                                    navigate("/candidate/theory-exam")
                                }
                            >
                                BACK TO PROGRESS
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
        maxWidth: "800px",
        margin: "0 auto"
    },

    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: "20px"
    },

    summaryCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: "20px",
        textAlign: "center"
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

    subtitle: {
        color: "#1e3c72",
        marginTop: 0,
        marginBottom: "15px"
    },

    sectionTitle: {
        color: "#1e3c72",
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "20px"
    },

    cardText: {
        color: "#333",
        fontSize: "16px",
        marginBottom: "10px"
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

    correctQuestionCard: {
        backgroundColor: "#ecfff0",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: "20px",
        border: "1px solid #5cb85c"
    },

    wrongQuestionCard: {
        backgroundColor: "#fff0f0",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: "20px",
        border: "1px solid #d9534f"
    },

    questionTitle: {
        color: "#1e3c72",
        marginBottom: "15px"
    },

    questionImage: {
        maxWidth: "160px",
        maxHeight: "160px",
        height: "auto",
        marginBottom: "15px",
        borderRadius: "8px",
        justifyContent: "flex-start"
    },

    correctText: {
        color: "#2e7d32",
        fontWeight: "bold"
    },

    wrongText: {
        color: "#b00020",
        fontWeight: "bold"
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "30px"
    },

    backButton: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "12px 30px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
    }
};

export default TheoryFinalExamResults;