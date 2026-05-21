function Sidebar({
    buttons,
    logout
}) {

    return (

        <div style={styles.sidebar}>

            <h2 style={styles.logo}>
                ĐIR
            </h2>

            {
                buttons.map((btn, index) => (

                    <button
                        key={index}
                        style={styles.menuBtn}
                        onClick={btn.onClick}
                    >
                        {btn.label}
                    </button>
                ))
            }

            <button
                onClick={logout}
                style={styles.logoutBtn}
            >
                Logout
            </button>

        </div>
    );
}

const styles = {

    sidebar: {
        width: "240px",
        backgroundColor: "#1e3c72",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
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

    logoutBtn: {
        marginTop: "auto",
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#d9534f",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer"
    }
};

export default Sidebar;