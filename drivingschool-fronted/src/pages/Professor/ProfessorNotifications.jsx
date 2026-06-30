import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import {
    getMyNotifications,
    markNotificationAsRead
} from "../../services/candidateService";

function ProfessorNotifications() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        const data = await getMyNotifications();
        setNotifications(data);
    };

    const logout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            method: "GET",
            credentials: "include"
        });

        localStorage.clear();
        navigate("/");
    };

    const handleMarkAsRead = async (id) => {
        await markNotificationAsRead(id);
        loadNotifications();
    };

    return (
        <div style={styles.container}>

            <Sidebar
                logout={logout}
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
            />

            <div style={styles.main}>

                <h1 style={styles.title}>
                    Notifications
                </h1>

                {notifications.length === 0 ? (
                    <div style={styles.emptyBox}>
                        No notifications yet.
                    </div>
                ) : (
                    <div style={styles.list}>
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                style={{
                                    ...styles.notificationCard,
                                    borderLeft: notification.read
                                        ? "6px solid #ccc"
                                        : "6px solid #1e3c72"
                                }}
                            >
                                <div>
                                    <h3 style={styles.notificationTitle}>
                                        {notification.title}
                                    </h3>

                                    <p style={styles.message}>
                                        {notification.message}
                                    </p>

                                    <p style={styles.date}>
                                        {notification.createdAt}
                                    </p>
                                </div>

                                {!notification.read && (
                                    <button
                                        onClick={() =>
                                            handleMarkAsRead(notification.id)
                                        }
                                        style={styles.readBtn}
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
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

export default ProfessorNotifications;