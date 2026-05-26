import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function InstructorProfile() {
    const [instructor, setInstructor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        fetch(
            "http://localhost:8080/instructor/profile",
            {
                method: "GET",
                credentials: "include"
            }
        )
            .then((response) => response.json())
            .then((data) => setInstructor(data))
            .catch((error) => console.log(error));
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (!instructor) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={styles.container}>

            <Sidebar
                buttons={[
                    {
                        label: "My Profile",
                        onClick: () => navigate("/instructor/profile")
                    },
                    {
                        label: "Schedule",
                        onClick: () => navigate("/instructor/schedule")
                    },
                    {
                        label: "Candidates",
                        onClick: () => navigate("/instructor/candidates")
                    },
                    {
                        label: "Vehicles",
                        onClick: () => navigate("/instructor/vehicles")
                    },
                    {
                        label: "Notifications",
                        onClick: () => navigate("/instructor/notifications")
                    }
                ]}
                logout={logout}
            />

            <div style={styles.content}>

                <h1>My Profile</h1>

                <div style={styles.card}>

                    <p>
                        <strong>First name:</strong> {instructor.firstName}
                    </p>

                    <p>
                        <strong>Last name:</strong> {instructor.lastName}
                    </p>

                    <p>
                        <strong>Email:</strong> {instructor.email}
                    </p>

                    <p>
                        <strong>Contact:</strong> {instructor.contact}
                    </p>

                </div>

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
        backgroundColor: "#f4f6f9"
    },

    card: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "500px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }
};

export default InstructorProfile;