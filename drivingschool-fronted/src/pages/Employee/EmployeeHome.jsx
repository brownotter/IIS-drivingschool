import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function EmployeeHome() {
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

                <div style={styles.center}>
                    <h1 style={styles.schoolName}>Autoškola ĐIR</h1>

                    <div style={styles.buttonsRow}>

                        <button
                            style={styles.addBtn}
                            onClick={() => navigate("/employee/documents/new")}
                        >
                             Add new <br></br> document
                        </button>

                        <button
                            style={styles.addBtn}
                            onClick={() => navigate("/employee/reports/new")}
                        >
                             Generate a document <br></br> completeness report
                        </button>

                    </div>

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
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
    },

    schoolName: {
        color: "#1e3c72",
        fontSize: "36px",
        fontWeight: "bold",
        letterSpacing: "4px",
        marginBottom: "40px",
        alignSelf: "center"
    },

    subtitle: {
        color: "#888",
        fontSize: "15px",
        marginBottom: "40px"
    },

    buttonsRow: {
    display: "flex",
    gap: "16px"
    },

    addBtn: {
        padding: "12px 24px",
        backgroundColor: "#1e3c72",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    }
};

export default EmployeeHome;