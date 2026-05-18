import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

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

            <div style={styles.card}>

                <div style={styles.header}>

                    <div style={styles.logo}>
                        ĐIR
                    </div>

                    <h1 style={{ margin: "10px 0 0 0" }}>
                        Home page
                    </h1>

                    <p style={styles.subtitle}>
                        Welcome 🚗
                    </p>

                </div>

                <div style={styles.content}>


                    <p style={styles.text}>
                        Ovde će kasnije biti: kandidati, časovi, testovi...
                    </p>

                </div>

                <button onClick={logout} style={styles.button}>
                    Logout
                </button>

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
        width: "400px",
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

    content: {
        marginTop: "20px",
        marginBottom: "20px"
    },

    text: {
        margin: "8px 0",
        color: "#333"
    },

    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#2a5298",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default Dashboard;