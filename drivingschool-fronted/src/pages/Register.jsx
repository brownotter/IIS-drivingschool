import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
        category: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const validateForm = () => {

        const {
            firstName,
            lastName,
            username,
            email,
            contact,
            password,
            confirmPassword,
            category
        } = formData;

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !username.trim() ||
            !email.trim() ||
            !contact.trim() ||
            !password.trim() ||
            !confirmPassword.trim() ||
            !category.trim()
        ) {
            return "All fields are required.";
        }

        if (firstName.length < 2) {
            return "First name must contain at least 2 characters.";
        }

        if (lastName.length < 2) {
            return "Last name must contain at least 2 characters.";
        }

        if (username.length < 4) {
            return "Username must contain at least 4 characters.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return "Invalid email format.";
        }

        const phoneRegex = /^[0-9+\s/-]+$/;

        if (!phoneRegex.test(contact)) {
            return "Invalid contact format.";
        }

        if (password.length < 6) {
            return "Password must contain at least 6 characters.";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }

        return null;
    };

    const handleRegister = async () => {

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/user/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            const data = await response.text();

            if (response.ok) {

                setSuccess("Registration successful!");

                setTimeout(() => {
                    navigate("/");
                }, 1500);

            } else {

                setError(data);
            }

        } catch (err) {

            setError("Server error. Please try again.");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <div style={styles.header}>

                    <div style={styles.logo}>
                        ĐIR
                    </div>

                    <h1 style={styles.title}>
                        Autoškola ĐIR
                    </h1>

                    <p style={styles.subtitle}>
                        Create your account 🚗
                    </p>

                </div>

                <div style={styles.form}>

                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        name="contact"
                        placeholder="Contact"
                        value={formData.contact}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={styles.select}
                    >

                        <option value="">
                            Choose category
                        </option>

                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>

                    </select>

                    <button
                        onClick={handleRegister}
                        style={styles.button}
                        disabled={loading}
                    >

                        {loading ? "Registering..." : "Register"}

                    </button>

                    {error && (
                        <div style={styles.errorBox}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={styles.successBox}>
                            {success}
                        </div>
                    )}

                    <p
                        style={styles.loginText}
                        onClick={() => navigate("/")}
                    >
                        Already have an account? Login
                    </p>

                </div>

            </div>

        </div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        padding: "20px"
    },

    card: {
        width: "400px",
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "35px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.2)"
    },

    header: {
        textAlign: "center",
        marginBottom: "25px"
    },

    logo: {
        width: "75px",
        height: "75px",
        borderRadius: "50%",
        backgroundColor: "#2a5298",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px",
        fontWeight: "bold",
        margin: "0 auto 10px auto"
    },

    title: {
        margin: 0,
        color: "#1e3c72"
    },

    subtitle: {
        color: "gray",
        fontSize: "14px",
        marginTop: "5px"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        outline: "none",
        transition: "0.2s"
    },

    select: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        backgroundColor: "white"
    },

    button: {
        marginTop: "10px",
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#2a5298",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
        transition: "0.2s"
    },

    errorBox: {
        backgroundColor: "#ffe5e5",
        color: "#d8000c",
        padding: "10px",
        borderRadius: "8px",
        textAlign: "center",
        fontSize: "14px"
    },

    successBox: {
        backgroundColor: "#e6ffed",
        color: "#1b7a35",
        padding: "10px",
        borderRadius: "8px",
        textAlign: "center",
        fontSize: "14px"
    },

    loginText: {
        marginTop: "10px",
        textAlign: "center",
        color: "#2a5298",
        cursor: "pointer",
        fontSize: "14px"
    }
};

export default Register;