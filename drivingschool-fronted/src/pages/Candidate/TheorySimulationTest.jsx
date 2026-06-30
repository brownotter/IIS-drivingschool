import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function TheorySimulationTest() {
    const navigate = useNavigate();
    const { testId } = useParams();

    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/api/theory-tests/${testId}/questions`, {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load questions.");
                }
                return response.json();
            })
            .then((data) => {
                setQuestions(data);
            })
            .catch((error) => {
                console.error("Error loading questions:", error);
                setErrorMessage("Failed to load questions.");
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

    const handleAnswerChange = (questionId, optionId) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: optionId
        });
        setValidationMessage("");
    };

    const submitAnswers = async () => {
        setValidationMessage("");

        if (Object.keys(selectedAnswers).length !== questions.length) {
            setValidationMessage("You must answer all questions before submitting.");
            return;
        }

        const dto = {
            theoryTestId: Number(testId),
            answers: questions.map((question) => ({
                questionId: question.questionId,
                selectedAnswerId: selectedAnswers[question.questionId]
            }))
        };

        try {
            setSubmitting(true);
            setErrorMessage("");

            const response = await fetch(
                "http://localhost:8080/api/theory-tests/submit",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dto)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit test.");
            }

            await response.json();

            navigate(`/candidate/theory-simulation/result/${testId}`);

        } catch (error) {
            console.error("Error submitting test:", error);
            setErrorMessage("Failed to submit test.");
        } finally {
            setSubmitting(false);
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
                <h1 style={styles.title}>Theory Simulation Test</h1>

                {loading && (
                    <div style={styles.contentBox}>
                        <div style={styles.card}>
                            <p>Loading questions...</p>
                        </div>
                    </div>
                )}

                {!loading && errorMessage && (
                    <div style={styles.errorCard}>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {!loading && !errorMessage && (
                    <div style={styles.contentBox}>
                        {questions.length === 0 ? (
                            <div style={styles.card}>
                                <p>No questions found.</p>
                            </div>
                        ) : (
                            questions.map((question, index) => (
                                <div key={question.questionId} style={styles.questionCard}>
                                    <h3 style={styles.questionTitle}>
                                        {index + 1}. {question.questionText}
                                    </h3>

                                    {question.imageUrl && (
                                        <img
                                            src={question.imageUrl}
                                            alt="Question"
                                            style={styles.questionImage}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    )}

                                    <div>
                                        {question.answers &&
                                            question.answers.map((answer) => (
                                                <label
                                                    key={answer.answerOptionId}
                                                    style={styles.answerOption}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.questionId}`}
                                                        value={answer.answerOptionId}
                                                        checked={
                                                            selectedAnswers[question.questionId] ===
                                                            answer.answerOptionId
                                                        }
                                                        onChange={() =>
                                                            handleAnswerChange(
                                                                question.questionId,
                                                                answer.answerOptionId
                                                            )
                                                        }
                                                    />

                                                    <span style={styles.answerText}>
                                                        {answer.answerText}
                                                    </span>
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            ))
                        )}

                        {validationMessage && (
                            <div style={styles.validationCard}>
                                <p>{validationMessage}</p>
                            </div>
                        )}

                        {questions.length > 0 && (
                            <div style={styles.buttonContainer}>
                                <button
                                    style={styles.submitButton}
                                    onClick={submitAnswers}
                                    disabled={submitting}
                                >
                                    {submitting ? "SUBMITTING..." : "SUBMIT"}
                                </button>
                            </div>
                        )}
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
        margin: "0 auto 20px auto"
    },

    questionCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: "20px"
    },

    questionTitle: {
        color: "#1e3c72",
        marginBottom: "15px"
    },

    questionImage: {
        display: "block",
        maxWidth: "160px",
        maxHeight: "160px",
        objectFit: "contain",
        borderRadius: "8px",
        justifyContent: "flex-start",
        marginBottom: "15px"
    },

    answerOption: {
        display: "block",
        marginBottom: "10px",
        color: "#333",
        cursor: "pointer"
    },

    answerText: {
        marginLeft: "8px"
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "30px"
    },

    submitButton: {
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "12px 30px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
    },

    validationCard: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ffeeba",
    marginTop: "20px",
    marginBottom: "20px",
    textAlign: "center"
    }
};

export default TheorySimulationTest;