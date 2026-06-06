const BASE_URL = "http://localhost:8080/employee";

export const getEmployeeProfile = async () => {
    const response = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) throw new Error("Failed to fetch profile.");
    return response.json();
};

export const updateEmployeeProfile = async (data) => {
    const response = await fetch(`${BASE_URL}/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Failed to update profile.");
    return response.text();
};

export const getActiveAlerts = async () => {
    const [expiringRes, expiredRes] = await Promise.all([
        fetch("http://localhost:8080/documents/expiring", { credentials: "include" }),
        fetch("http://localhost:8080/documents/expired", { credentials: "include" })
    ]);

    const expiring = await expiringRes.json();
    const expired = await expiredRes.json();

    return { expiring, expired };
};