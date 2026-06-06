const BASE_URL = "http://localhost:8080/documents";

export const getAllDocuments = async () => {
    const response = await fetch(`${BASE_URL}/all`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch documents.");
    return response.json();
};

export const getDocumentsByCandidate = async (candidateId) => {
    const response = await fetch(`${BASE_URL}/candidate/${candidateId}`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch documents.");
    return response.json();
};

export const createMedicalExam = async (candidateId, employeeId, data) => {
    const response = await fetch(`${BASE_URL}/candidate/${candidateId}/employee/${employeeId}/medical-exam`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to create document.");
    return response.json();
};

export const createCertificate = async (candidateId, employeeId, data) => {
    const response = await fetch(`${BASE_URL}/candidate/${candidateId}/employee/${employeeId}/certificate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to create document.");
    return response.json();
};

export const createContract = async (candidateId, employeeId, data) => {
    const response = await fetch(`${BASE_URL}/candidate/${candidateId}/employee/${employeeId}/contract`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to create document.");
    return response.json();
};

export const createExamResult = async (candidateId, employeeId, data) => {
    const response = await fetch(`${BASE_URL}/candidate/${candidateId}/employee/${employeeId}/exam-result`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to create document.");
    return response.json();
};

export const searchDocuments = async (title, status, documentType) => {
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (status) params.append("status", status);
    if (documentType) params.append("documentType", documentType);

    const response = await fetch(
        `http://localhost:8080/documents/search?${params.toString()}`,
        { credentials: "include" }
    );
    if (!response.ok) throw new Error("Search failed.");
    return response.json();
};

export const getDocumentDetails = async (documentId) => {
    const response = await fetch(
        `http://localhost:8080/documents/${documentId}`,
        { credentials: "include" }
    );
    if (!response.ok) throw new Error("Failed to fetch document details.");
    return response.json();
};

export const updateMedicalExam = async (documentId, data) => {
    const response = await fetch(
        `http://localhost:8080/documents/${documentId}/medical-exam`,
        {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    );
    if (!response.ok) throw new Error("Failed to update document.");
    return response.json();
};

export const updateCertificate = async (documentId, data) => {
    const response = await fetch(
        `http://localhost:8080/documents/${documentId}/certificate`,
        {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    );
    if (!response.ok) throw new Error("Failed to update document.");
    return response.json();
};

export const updateContract = async (documentId, data) => {
    const response = await fetch(
        `http://localhost:8080/documents/${documentId}/contract`,
        {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    );
    if (!response.ok) throw new Error("Failed to update document.");
    return response.json();
};

export const updateExamResult = async (documentId, data) => {
    const response = await fetch(
        `http://localhost:8080/documents/${documentId}/exam-result`,
        {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    );
    if (!response.ok) throw new Error("Failed to update document.");
    return response.json();
};

export const getDocumentValidity = async (documentId) => {
    const response = await fetch(
        `http://localhost:8080/documents/${documentId}/validity`,
        { credentials: "include" }
    );
    if (!response.ok) return null;
    return response.json();
};