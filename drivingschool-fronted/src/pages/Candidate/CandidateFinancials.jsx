import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import {
    getCandidateFinancials
} from "../../services/candidateService";

function CandidateFinancials() {

    const navigate = useNavigate();

    const [financials, setFinancials] =
        useState(null);

    useEffect(() => {
        loadFinancials();
    }, []);

    const loadFinancials = async () => {

        const data =
            await getCandidateFinancials();

        setFinancials(data);
    };

    const logout = async () => {

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

    if (!financials) {
        return <h2>Loading...</h2>;
    }

    return (

        <div style={styles.container}>

            <Sidebar
                logout={logout}
                buttons={[
                    {
                        label: "My Profile",
                        onClick: () => navigate("/candidate")
                    },
                    {
                        label: "Financials",
                        onClick: () => navigate("/candidate/financials")
                    },
            {
                        label: "Schedule",
                        onClick: () => navigate("/candidate/theory-schedule")
                    },
                    {
                        label: "Notifications",
                        onClick: () => navigate("/candidate/notifications")
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
                    Financials
                </h1>

                <div style={styles.topCards}>

                    <div style={styles.card}>

                        <h2>
                            Package
                        </h2>

                        <p>
                            <b>Package:</b> {financials.category} category
                        </p>

                        <p>
                            <b>Total price:</b> {financials.totalPrice} RSD
                        </p>

                        <p>
                            <b>Paid:</b> {financials.totalPaid} RSD
                        </p>

                        <p>
                            <b>Remaining:</b> {financials.remainingAmount} RSD
                        </p>

                    </div>

                    <div style={styles.card}>

                        <h2>
                            Payment instructions
                        </h2>

                        <p>
                            <b>Account number:</b> 123-456789-00
                        </p>

                        <p>
                            <b>Reference number:</b> 97
                        </p>

                        <p>
                            <b>Payment purpose:</b> Driving school training
                        </p>

                    </div>

                </div>

                <div style={styles.section}>

                    <h2>
                        Payment history
                    </h2>

                    {
                        financials.payments.length === 0 ? (

                            <p>
                                No payments yet.
                            </p>

                        ) : (

                            <table style={styles.table}>

                                <thead>

                                    <tr style={styles.tableHeader}>

                                        <th style={styles.th}>
                                            Amount
                                        </th>

                                        <th style={styles.th}>
                                            Date
                                        </th>

                                        <th style={styles.th}>
                                            Method
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        financials.payments.map(
                                            (payment, index) => (

                                                <tr key={index}>

                                                    <td style={styles.td}>
                                                        {payment.amount} RSD
                                                    </td>

                                                    <td style={styles.td}>
                                                        {payment.paymentDate}
                                                    </td>

                                                    <td style={styles.td}>
                                                        {payment.method}
                                                    </td>

                                                </tr>
                                            )
                                        )
                                    }

                                </tbody>

                            </table>
                        )
                    }

                </div>

                <div style={styles.section}>

                    <h2>
                        Financial obligations
                    </h2>

                    {
                        financials.fullyPaid ? (

                            <div style={styles.successBox}>
                                All payments are completed.
                            </div>

                        ) : (

                            <div style={styles.obligationBox}>

                                <p>
                                    <b>Next payment due:</b>{" "}
                                    {
                                        financials.nextPaymentDate
                                            ? financials.nextPaymentDate
                                            : "No previous payment"
                                    }
                                </p>

                                <p>
                                    <b>Amount:</b>{" "}
                                    {financials.nextPaymentAmount} RSD
                                </p>

                            </div>
                        )
                    }

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
        padding: "40px"
    },

    title: {
        textAlign: "center",
        color: "#1e3c72",
        marginBottom: "30px"
    },

    topCards: {
        display: "flex",
        gap: "30px",
        marginBottom: "35px"
    },

    card: {
        flex: 1,
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
    },

    section: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: "30px"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "15px"
    },

    tableHeader: {
        backgroundColor: "#1e3c72"
    },

    th: {
        padding: "14px",
        color: "white",
        textAlign: "center"
    },

    td: {
        padding: "14px",
        borderBottom: "1px solid #eee",
        textAlign: "center"
    },

    obligationBox: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "15px",
        width: "300px",
        backgroundColor: "#f9f9f9"
    },

    successBox: {
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#d4edda",
        color: "#155724",
        fontWeight: "bold",
        width: "300px"
    }
};

export default CandidateFinancials;