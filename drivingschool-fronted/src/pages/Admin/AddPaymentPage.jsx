import {
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

function AddPaymentPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({

            amount: "",

            paymentDate: "",

            method: "CASH"
        });

    const [message, setMessage] =
        useState("");

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value
        });
    };

const handleSubmit = async () => {

    try {

        const response = await fetch(

            `http://localhost:8080/candidate/${id}/payment`,

            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                credentials: "include",

                body: JSON.stringify(formData)
            }
        );

        const data =
            await response.text();

        if(!response.ok) {

            setMessage(data);
            return;
        }

        setMessage(data);

        setTimeout(() => {

            navigate(
                `/admin/candidate/${id}`
            );

        }, 1200);

    } catch (err) {

        setMessage(
            "Server error."
        );
    }
};

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h1>
                    Add Payment
                </h1>

                <input
                    type="number"
                    name="amount"
                    placeholder="Enter paid amount"
                    value={formData.amount}
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    style={styles.input}
                />

                <select
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    style={styles.input}
                >

                    <option value="CASH">
                        Cash
                    </option>

                    <option value="TRANSFER">
                        Transfer
                    </option>

                </select>

                <button
                    onClick={handleSubmit}
                    style={styles.button}
                >
                    Save Payment
                </button>

                {
                    message && (

                        <p>
                            {message}
                        </p>
                    )
                }

            </div>

        </div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7fb"
    },

    card: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        boxShadow:
            "0 5px 15px rgba(0,0,0,0.1)"
    },

    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },

    button: {
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#1e3c72",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default AddPaymentPage;