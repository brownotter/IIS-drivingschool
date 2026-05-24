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