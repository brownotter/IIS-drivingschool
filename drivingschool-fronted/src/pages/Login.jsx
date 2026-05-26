import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

   const handleLogin = async () => {

    setError("");

    try {

        const response = await fetch(
            "http://localhost:8080/user/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();
        //console.log(data);

        if (response.ok) {

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

            switch (data.role) {

                case "ADMIN":
                    navigate("/admin/profile");
                    break;

                case "CANDIDATE":
                    navigate("/candidate");
                    break;
                    
                case "PROFESSOR":
                    navigate("/professor/dashboard");
                    break;    

                case "INSTRUCTOR":
                    navigate("/instructor/profile");
                    
                case "EMPLOYEE":
                    navigate("/employee");
                    break;

                default:
                    navigate("/");
            }

        } else {

            setError(data.message || "Invalid username or password");
        }

    } catch (err) {

        setError("Server error.");
    }
};

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <div style={styles.header}>

                    <div style={styles.logo}>
                        ĐIR
                    </div>

                    <h1 style={{ margin: "10px 0 0 0" }}>
                        Autoškola ĐIR
                    </h1>

                    <p style={styles.subtitle}>
                        Login to proceed 🚗
                    </p>

                </div>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button
                    onClick={handleLogin}
                    style={styles.button}
                >
                    Login
                </button>

                <p style={{ marginTop: "10px" }}>
    If you don't have an account,
    <span
        onClick={() => navigate("/register")}
        style={{
            color: "blue",
            cursor: "pointer",
            marginLeft: "5px"
        }}
    >
        register here
    </span>
</p>

                {error && (
                    <div style={styles.errorBox}>
                        {error}
                    </div>
                )}

            </div>

        </div>
    );
}

const styles = {

    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)"
    },

    card: {
        width: "350px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center"
    },

    header: {
        marginBottom: "20px"
    },

    logo: {
        width: "70px",
        height: "70px",
        margin: "0 auto",
        borderRadius: "50%",
        backgroundColor: "#2a5298",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "26px",
        fontWeight: "bold"
    },

    subtitle: {
        fontSize: "14px",
        color: "gray",
        marginTop: "5px"
    },

    input: {
        width: "90%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },

    button: {
        width: "60%",
        padding: "10px",
        backgroundColor: "#2a5298",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    errorBox: {
        marginTop: "15px",
        padding: "10px",
        backgroundColor: "#ffe5e5",
        color: "#d8000c",
        borderRadius: "6px",
        textAlign: "center"
    }
};

export default Login;