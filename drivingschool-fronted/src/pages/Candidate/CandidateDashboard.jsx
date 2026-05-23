import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import {
    getCandidateProfile,
    updateCandidateProfile
} from "../../services/candidateService";


function CandidateDashboard() {
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

            const data =
                await getCandidateProfile();

            setProfile(data);

            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                contact: data.contact
            });

        } catch (err) {

            //console.log(err); valjda ne ovako?
            navigate("/");
        }
    };

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {

        try {

            const response =
                await updateCandidateProfile(formData);

            setMessage(response);

            setEditMode(false);

            loadProfile();

        } catch (err) {

            setMessage("Update failed.");
        }
    };

    if (!profile) {
        return <h2>Loading...</h2>;
    }

const logout = async () => {

    //dodala logout logiku
    await fetch(
        "http://localhost:8080/user/logout",
        {
            method: "GET",
            credentials: "include"
        }
    );

    localStorage.clear();

    navigate("/");
};

    return (

        <div style={styles.container}>

           <Sidebar
    logout={logout}

    buttons={[

        {
            label: "My Profile",
            onClick: () =>
                navigate("/candidate")
        },

        {
            label: "Schedule",
            onClick: () => 
                navigate("/candidate/theory-schedule")
        },

        {
            label: "Notifications",
            onClick: () => {}
        },

        {
            label: "Theory Simulation",
            onClick: () => {}
        },

        {
            label: "Theory Exam",
            onClick: () => {}
        },

        {
            label: "Reports",
            onClick: () => {}
        }
    ]}
/>

            <div style={styles.main}>

                <h1 style={styles.title}>
                    My Profile
                </h1>

                

                <div style={styles.profileCard}>

                    <div>

                        {
                            editMode ? (

                                <div style={styles.form}>

                                    <input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />

                                    <input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />

                                    <input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />

                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />

                                    <input
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />

                                    <button
                                        onClick={handleUpdate}
                                        style={styles.saveBtn}
                                    >
                                        Save
                                    </button>

                                </div>

                            ) : (

                                <div>

                                    <p>
                                        <b>First Name:</b> {profile.firstName}
                                    </p>

                                    <p>
                                        <b>Last Name:</b> {profile.lastName}
                                    </p>

                                    <p>
                                        <b>Username:</b> {profile.username}
                                    </p>

                                    <p>
                                        <b>Email:</b> {profile.email}
                                    </p>

                                    <p>
                                        <b>Contact:</b> {profile.contact}
                                    </p>

                                </div>
                            )
                        }

                    </div>

                    <button
                        onClick={() =>
                            setEditMode(!editMode)
                        }
                        style={styles.editBtn}
                    >
                        ✏️
                    </button>

                </div>

                <div style={styles.statusBox}>

                    Current status:
                    {" "}
                    <b>
                        {profile.status}
                    </b>

                </div>


{
    profile.status !== "COMPLETED" && (

        <div style={styles.cardsContainer}>


            <div style={styles.card}>

                <h2>
                    Progress
                </h2>

                {
                    profile.status === "THEORY" ? (

                        <>
                            <p>
                                Theory classes:
                                {" "}
                                {profile.theoryClassesCount}/40
                            </p>

                            <p>
                                Theory attempts:
                                {" "}
                                {profile.theoryAttemptsCount}
                            </p>
                        </>

                    ) : (

                        <>
                            <p>
                                Driving classes:
                                {" "}
                                {profile.practiceClassesCount}/40
                            </p>

                            <p>
                                Driving attempts:
                                {" "}
                                {profile.practiceAttemptsCount}
                            </p>
                        </>
                    )
                }

            </div>

            {
                profile.status === "DRIVING" && (

                    <>
                        {/* AREAS */}

                        <div style={styles.card}>

                            <h2>
                                Areas to improve
                            </h2>

                            <p>
                                No areas detected yet.
                            </p>

                        </div>


                        <div style={styles.card}>

                            <h2>
                                Recommendations
                            </h2>

                            <p>
                                No active recommendations.
                            </p>

                        </div>
                    </>
                )
            }

        </div>
    )
}

                {
                    message && (

                        <div style={styles.message}>

                            {message}

                        </div>
                    )
                }

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

    sidebar: {
        width: "240px",
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

       logoutBtn: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d9534f",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
},

    logo: {
        textAlign: "center",
        marginBottom: "20px"
    },

    menuBtn: {
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "white",
        color: "#1e3c72",
        fontWeight: "bold"
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
        backgroundColor: "#2a5298",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer"
    },

    statusBox: {
        marginTop: "25px",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "12px",
        fontSize: "20px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },

    cardsContainer: {
        display: "flex",
        gap: "20px",
        marginTop: "30px"
    },

    card: {
        flex: 1,
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },

    message: {
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#d4edda",
        borderRadius: "8px",
        color: "#155724"
    }

 
};

export default CandidateDashboard;