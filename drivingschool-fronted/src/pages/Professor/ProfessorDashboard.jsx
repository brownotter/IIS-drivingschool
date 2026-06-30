import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import ProfessorCandidatesTable from "./ProfessorCandidatesTable";

function ProfessorDashboard() {
    const [professor, setProfessor] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contact: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        loadProfessorProfile();
    }, []);

    const loadProfessorProfile = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/user/professor/profile",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load professor profile.");
            }

            const data = await response.json();

            setProfessor(data);

            setFormData({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                username: data.username || "",
                email: data.email || "",
                contact: data.contact || ""
            });

        } catch (error) {
            console.error("Error loading professor profile:", error);
            navigate("/");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            setMessage("");

            const response = await fetch(
                "http://localhost:8080/user/update",
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error("Update failed.");
            }

            const responseText = await response.text();

            setMessage(responseText || "Profile updated successfully.");
            setEditMode(false);

            await loadProfessorProfile();

        } catch (error) {
            console.error("Error updating professor profile:", error);
            setMessage("Update failed.");
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

    if (!professor) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingBox}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Sidebar
                buttons={[
                    {
                        label: "My Profile",
                        onClick: () => navigate("/professor/dashboard")
                    },
                    {
                        label: "Schedule",
                        onClick: () => navigate("/professor/schedule")
                    },
                    {
                        label: "My Availability",
                        onClick: () => navigate("/professor/availability")
                    },
                    {
                        label: "Notifications",
                        onClick: () => navigate("/professor/notifications")
                    }
                ]}
                logout={logout}
            />

            <div style={styles.content}>
                <h1 style={styles.title}>My Profile</h1>

                <div style={styles.profileCard}>
                    <div style={styles.profileContent}>
                        {editMode ? (
                            <div style={styles.form}>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="First name"
                                />

                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Last name"
                                />

                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Username"
                                />

                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Email"
                                />

                                <input
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Contact"
                                />

                                <div style={styles.editActions}>
                                    <button
                                        onClick={handleUpdate}
                                        style={styles.saveBtn}
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setMessage("");
                                            setFormData({
                                                firstName: professor.firstName || "",
                                                lastName: professor.lastName || "",
                                                username: professor.username || "",
                                                email: professor.email || "",
                                                contact: professor.contact || ""
                                            });
                                        }}
                                        style={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p style={styles.profileText}>
                                    <b>First name:</b> {professor.firstName}
                                </p>

                                <p style={styles.profileText}>
                                    <b>Last name:</b> {professor.lastName}
                                </p>

                                <p style={styles.profileText}>
                                    <b>Username:</b> {professor.username}
                                </p>

                                <p style={styles.profileText}>
                                    <b>Email:</b> {professor.email}
                                </p>

                                <p style={styles.profileText}>
                                    <b>Contact:</b> {professor.contact}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setEditMode(!editMode);
                            setMessage("");
                        }}
                        style={styles.editBtn}
                    >
                        ✏️
                    </button>
                </div>

                {message && (
                    <div
                        style={{
                            ...styles.message,
                            backgroundColor:
                                message === "Update failed." ? "#ffecec" : "#d4edda",
                            color:
                                message === "Update failed." ? "#b00020" : "#155724",
                            border:
                                message === "Update failed."
                                    ? "1px solid #d9534f"
                                    : "1px solid #c3e6cb"
                        }}
                    >
                        {message}
                    </div>
                )}

                <ProfessorCandidatesTable />
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

    content: {
        flex: 1,
        padding: "40px",
        backgroundColor: "#f4f7fb"
    },

    title: {
        color: "#1e3c72",
        marginBottom: "25px",
        textAlign: "center"
    },

    profileCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        maxWidth: "750px",
        display: "flex",
        justifyContent: "flex-start",
        gap: "20px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
    },

    profileContent: {
        flex: 1
    },

    profileText: {
        margin: "0 0 12px 0",
        color: "#333",
        fontSize: "16px"
    },

    editBtn: {
        height: "45px",
        width: "45px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
        backgroundColor: "#eaf1fb"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #d9d9d9",
        fontSize: "14px",
        outline: "none"
    },

    editActions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px"
    },

    saveBtn: {
        padding: "10px 20px",
        border: "none",
        backgroundColor: "#1e3c72",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    cancelBtn: {
        padding: "10px 20px",
        border: "1px solid #1e3c72",
        backgroundColor: "white",
        color: "#1e3c72",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    message: {
        maxWidth: "650px",
        margin: "0 auto 25px auto",
        padding: "15px",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: "bold"
    },

    loadingBox: {
        margin: "50px auto",
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        color: "#333"
    }
};

export default ProfessorDashboard;