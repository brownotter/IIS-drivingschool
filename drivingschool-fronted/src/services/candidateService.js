const API = "http://localhost:8080/candidate";

export const getCandidateProfile = async () => {

    const response = await fetch(
        `${API}/profile`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load profile");
    }

    return response.json();
};

export const updateCandidateProfile = async (data) => {

    const response = await fetch(
        `${API}/update`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        throw new Error("Update failed");
    }

    return response.text();

    
};

export const getCandidateById =
async (id) => {

    const response = await fetch(

        `http://localhost:8080/candidate/${id}`,

        {
            credentials: "include"
        }
    );

    return await response.json();
};

export const adminUpdateCandidate =
async (id, formData) => {

    const response = await fetch(

        `http://localhost:8080/candidate/admin/update/${id}`,

        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(formData)
        }
    );

    return await response.text();
};

export const getAllCandidates = async () => {

    const response = await fetch(
        `${API}/all`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch candidates");
    }

    return response.json();
};