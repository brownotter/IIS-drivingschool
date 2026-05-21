import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {getCandidateById,adminUpdateCandidate} from "../../services/candidateService";
import { useNavigate } from "react-router-dom";


function CandidateDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [candidate, setCandidate] =
        useState(null);

    const [editMode, setEditMode] =
    useState(false);

    const [message, setMessage] =
    useState("");

    const [formData, setFormData] =
    useState({

        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contact: ""
    });

    useEffect(() => {

        loadCandidate();

    }, []);

    const loadCandidate = async () => {

        try {

            const data =
                await getCandidateById(id);

            setCandidate(data);

            setFormData({

            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            contact: data.contact
             });

        } catch (err) {

            console.log(err);
        }
    };

    const handleChange = (e) => {

    setFormData({

        ...formData,

        [e.target.name]:
            e.target.value
    });
};

const handleUpdate = async () => {

    try {

        const response =

            await adminUpdateCandidate(
                id,
                formData
            );

        setMessage(response);

        setEditMode(false);

        loadCandidate();

    } catch (err) {

        setMessage(
            "Update failed."
        );
    }
};

    if (!candidate) {

        return <h2>Loading...</h2>;
    }

    return (

    <div style={styles.container}>

        <h1 style={styles.title}>
            Candidate Details
        </h1>

        {/* PROFILE CARD */}

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
                <b>First Name:</b>
                {" "}
                {candidate.firstName}
            </p>

            <p>
                <b>Last Name:</b>
                {" "}
                {candidate.lastName}
            </p>

            <p>
                <b>Username:</b>
                {" "}
                {candidate.username}
            </p>

            <p>
                <b>Email:</b>
                {" "}
                {candidate.email}
            </p>

            <p>
                <b>Contact:</b>
                {" "}
                {candidate.contact}
            </p>

            <p>
                <b>Status:</b>
                {" "}
                {candidate.status}
            </p>

        </div>
    )
}

            </div>
                    <button
            style={styles.editBtn}

            onClick={() =>
                setEditMode(!editMode)
            }
        >
            {
                editMode
                    ? "Cancel"
                    : "Edit Profile"
            }
                </button>

        </div>

        {/* PROGRESS */}

        <div style={styles.cardsContainer}>

            {/* THEORY */}

            <div style={styles.card}>

                <h2>
                    Theory Progress
                </h2>

                <p>
                    Classes:
                    {" "}
                    {candidate.theoryClassesCount}
                    /40
                </p>

                <p>
                    Attempts:
                    {" "}
                    {candidate.theoryAttemptsCount}
                </p>

                <p>
                    Score:
                    {" "}
                    {
                        candidate.theoryScore
                            ?? "Not passed yet"
                    }
                </p>

            </div>

            {/* DRIVING */}

            <div style={styles.card}>

                <h2>
                    Driving Progress
                </h2>

                <p>
                    Classes:
                    {" "}
                    {candidate.practiceClassesCount}
                    /40
                </p>

                <p>
                    Attempts:
                    {" "}
                    {candidate.practiceAttemptsCount}
                </p>

                <p>
                    Score:
                    {" "}
                    {
                        candidate.drivingScore
                            ?? "Not passed yet"
                    }
                </p>

            </div>

        </div>

        {/* FINANCIALS */}

        <div style={styles.financialCard}>

            <div style={styles.financialHeader}>

                <h2>
                    Financials
                </h2>

                <button

            style={styles.paymentBtn}

            onClick={() =>

                navigate(

                    `/admin/candidate/${candidate.id}/add-payment`
                )
            }
        >
            Add Payment
            </button>

            </div>

            <p>
                <b>Category:</b>
                {" "}
                {candidate.category}
            </p>

                        <p>
                Category Price:
                {" "}
                {candidate.categoryPrice} RSD
            </p>

                <p>
            Paid:
            {" "}
            {candidate.totalPaid} RSD
        </p>

        <p>
            Remaining:
            {" "}
            {candidate.remainingAmount} RSD
        </p>

        </div>

    </div>
);

{
    message && (

        <div style={styles.message}>

            {message}

        </div>
    )
}
}

const styles = {

    container: {
        padding: "40px",
        backgroundColor: "#f4f7fb",
        minHeight: "100vh",
        fontFamily: "Arial"
    },

    title: {
        color: "#1e3c72",
        marginBottom: "30px"
    },

    profileCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "25px",
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        marginBottom: "30px"
    },

    editBtn: {
        height: "45px",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#2a5298",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
    },

    cardsContainer: {
        display: "flex",
        gap: "20px",
        marginBottom: "30px"
    },

    card: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },

    financialCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "25px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },

    financialHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },

    paymentBtn: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#1e3c72",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
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
    borderRadius: "8px",
    backgroundColor: "#2a5298",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
},

message: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#d4edda",
    borderRadius: "8px",
    color: "#155724"
},

    
};



export default CandidateDetails;