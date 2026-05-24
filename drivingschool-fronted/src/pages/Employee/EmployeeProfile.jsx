import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getEmployeeProfile, updateEmployeeProfile } from "../../services/employeeService";

function EmployeeProfile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contact: ""
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getEmployeeProfile();
            setProfile(data);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                contact: data.contact
            });
        } catch (err) {
            navigate("/");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await updateEmployeeProfile(formData);
            setMessage(response);
            setEditMode(false);
            loadProfile();
        } catch (err) {
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

    if (!profile) return <h2>Loading...</h2>;

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

                <h1 style={styles.title}>My Profile</h1>

                <div style={styles.profileCard}>

                    <div>
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
                                <button onClick={handleUpdate} style={styles.saveBtn}>
                                    Save
                                </button>
                            </div>

                        ) : (

                            <div style={styles.infoBox}>
                                <p><b>First Name:</b> {profile.firstName}</p>
                                <p><b>Last Name:</b> {profile.lastName}</p>
                                <p><b>Username:</b> {profile.username}</p>
                                <p><b>Email:</b> {profile.email}</p>
                                <p><b>Contact:</b> {profile.contact}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setEditMode(!editMode)}
                        style={styles.editBtn}
                    >
                        ✏️
                    </button>

                </div>

                {message && (
                    <div style={styles.message}>{message}</div>
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
        marginBottom: "25px",
        color: "#1e3c72"
    },

    profileCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },

    infoBox: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontSize: "15px"
    },

    editBtn: {
        height: "45px",
        width: "45px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        fontSize: "18px"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },

    saveBtn: {
        padding: "10px",
        border: "none",
        backgroundColor: "#1e3c72",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer"
    },

    message: {
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#d4edda",
        borderRadius: "8px",
        color: "#155724"
    }
};

export default EmployeeProfile;