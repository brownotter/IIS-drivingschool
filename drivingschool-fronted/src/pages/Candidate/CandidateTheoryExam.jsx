import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function CandidateTheoryExam() {

    const navigate = useNavigate();

    const logout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            method: "GET",
            credentials: "include"
        });
        localStorage.clear();
        navigate("/");
    }

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
                <h1 style={styles.title}>Theory Exam</h1>
                {/* Add your content here */}
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
        color: "#1e3c72",
        marginBottom: "25px"
    },

    list: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    notificationCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    notificationTitle: {
        margin: "0 0 8px 0",
        color: "#1e3c72"
    },

    message: {
        margin: "0 0 8px 0",
        color: "#333"
    },

    date: {
        margin: 0,
        fontSize: "13px",
        color: "gray"
    },

    readBtn: {
        padding: "10px 15px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#2a5298",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
    },

    emptyBox: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        color: "gray"
    }
};

export default CandidateTheoryExam;
