import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import ProfessorCandidatesTable from "./ProfessorCandidatesTable"; 

function ProfessorDashboard() {
    const [professor, setProfessor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(
            "http://localhost:8080/user/professor/profile",
            {
                method: "GET",
                credentials: "include"
            }
        )
            .then((response) => response.json())
            .then((data) => setProfessor(data))
            .catch((error) => console.log(error));
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (!professor) {
        return <h2>Loading...</h2>;
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
                <h1 style={{ color: "#1e3c72", marginBottom: "20px" }}>My Profile</h1>

                <div style={styles.card}>
                    <p>
                        <strong>First name:</strong> {professor.firstName}
                    </p>
                    <p>
                        <strong>Last name:</strong> {professor.lastName}
                    </p>
                    <p>
                        <strong>Username:</strong> {professor.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {professor.email}
                    </p>
                    <p>
                        <strong>Contact:</strong> {professor.contact}
                    </p>
                </div>

                <ProfessorCandidatesTable />

            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh"
    },
    content: {
        flex: 1,
        padding: "40px",
        backgroundColor: "#f9f4f5"
    },
    card: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "500px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }
};

export default ProfessorDashboard;