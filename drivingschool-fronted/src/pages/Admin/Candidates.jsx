import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Candidates() {

    const [candidates, setCandidates] = useState([]);

    const [category, setCategory] = useState("");

    const [status, setStatus] = useState("");

    const navigate = useNavigate();
    

    useEffect(() => {

        fetchCandidates();

    }, [category, status]);

    const fetchCandidates = async () => {

        let url =
            "http://localhost:8080/candidate/all";

        const params = [];

        if(category) {
            params.push(`category=${category}`);
        }

        if(status) {
            params.push(`status=${status}`);
        }

        if(params.length > 0) {
            url += "?" + params.join("&");
        }

        try {

            const response = await fetch(
                url,
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            setCandidates(data);

        } catch(error) {

            console.log(error);
        }
    };

    const logout = () => {

        localStorage.removeItem("user");

        window.location.href = "/";
    };

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
                    }
                ]}
                logout={logout}
            />

            <div style={styles.content}>

                <h1>Candidates</h1>

                <div style={styles.filters}>

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    >

                        <option value="">
                            Filter by category
                        </option>

                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>

                    </select>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="">
                            Filter by status
                        </option>

                        <option value="THEORY">
                            THEORY
                        </option>

                        <option value="DRIVING">
                            DRIVING
                        </option>

                        <option value="COMPLETED">
                            COMPLETED
                        </option>

                    </select>

                </div>

<table style={styles.table}>

    <thead>

        <tr style={styles.tableHeaderRow}>

            <th style={styles.th}>
                First Name
            </th>

            <th style={styles.th}>
                Last Name
            </th>

            <th style={styles.th}>
                Category
            </th>

            <th style={styles.th}>
                Status
            </th>

        </tr>

    </thead>

    <tbody>

        {
            candidates.map((candidate) => (

                <tr
                    key={candidate.id}

                    onClick={() =>
                        navigate(`/admin/candidate/${candidate.id}`)
                    }

                    style={styles.row}
                >

                    <td style={styles.td}>
                        {candidate.firstName}
                    </td>

                    <td style={styles.td}>
                        {candidate.lastName}
                    </td>

                    <td style={styles.td}>
                        {candidate.category}
                    </td>

                    <td style={styles.td}>

                        <span
                            style={{
                                ...styles.statusBadge,

                                backgroundColor:
                                    candidate.status === "THEORY"
                                        ? "#fff3cd"
                                        : candidate.status === "DRIVING"
                                        ? "#d1ecf1"
                                        : "#d4edda",

                                color:
                                    candidate.status === "THEORY"
                                        ? "#856404"
                                        : candidate.status === "DRIVING"
                                        ? "#0c5460"
                                        : "#155724"
                            }}
                        >

                            {candidate.status}

                        </span>

                    </td>

                </tr>
            ))
        }

    </tbody>

</table>

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

    filters: {
        display: "flex",
        gap: "20px",
        marginBottom: "20px"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
    },

    tableHeaderRow: {
    backgroundColor: "#1e3c72"
},

th: {
    padding: "16px",
    color: "white",
    textAlign: "left",
    fontSize: "15px"
},

td: {
    padding: "16px",
    borderBottom: "1px solid #eee"
},

statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px"
},

    row: {
    cursor: "pointer",
    transition: "0.2s"
},
};

export default Candidates;