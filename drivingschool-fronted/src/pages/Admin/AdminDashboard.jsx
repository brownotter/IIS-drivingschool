import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function AdminProfile() {

    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        fetch(
            "http://localhost:8080/user/admin/profile",
            {
                method: "GET",
                credentials: "include"
            }
        )
            .then((response) => response.json())
            .then((data) => setAdmin(data))
            .catch((error) => console.log(error));

    }, []);

    const logout = () => {

        localStorage.removeItem("user");

        window.location.href = "/";
    };

    if(!admin) {
        return <h2>Loading...</h2>;
    }

    return (

        <div style={styles.container}>

            

            <Sidebar
    buttons={[
        {
            label: "My Profile",
            onClick: () => navigate("/admin/profile")
        },
        {
            label: "Candidates",
            onClick: () => navigate("/admin/candidates")
        },
        {
            label: "Theory Schedule",
            onClick: () => navigate("/admin/theory-schedule")
        }

    ]}
    logout={logout}
/>
            

            <div style={styles.content}>

                <h1>My Profile</h1>

                <div style={styles.card}>

                    <p>
                        <strong>First name:</strong> {admin.firstName}
                    </p>

                    <p>
                        <strong>Last name:</strong> {admin.lastName}
                    </p>

                    <p>
                        <strong>Username:</strong> {admin.username}
                    </p>

                    <p>
                        <strong>Email:</strong> {admin.email}
                    </p>

                    <p>
                        <strong>Contact:</strong> {admin.contact}
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

export default AdminProfile;