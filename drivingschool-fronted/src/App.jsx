import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminProfile from "./pages/Admin/AdminDashboard";
import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Candidates from "./pages/Admin/Candidates";
import CandidateDetails from "./pages/Admin/CandidateDetails";
import AddPaymentPage from "./pages/Admin/AddPaymentPage";
import EmployeeHome from "./pages/Employee/EmployeeHome";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";
import CreateDocumentPage from "./pages/Employee/CreateDocumentPage";
import DocumentsPage from "./pages/Employee/DocumentsPage";
import DocumentDetailsPage from "./pages/Employee/DocumentDetailsPage";
import EditDocumentPage from "./pages/Employee/EditDocumentPage";
import CandidatesPage from "./pages/Employee/CandidatesPage";
import CandidateDocumentsPage from "./pages/Employee/CandidateDocumentsPage";

function App() {

    return (

        <Routes>

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/admin/profile"
                element={<AdminProfile />}
            />

            <Route
                path="/candidate"
                element={<CandidateDashboard />}
            />

            <Route
                path="/admin/candidates"
                element={<Candidates />}
            />

            <Route
                path="/admin/candidate/:id"
                element={<CandidateDetails />}
            />

            <Route
                path="/admin/candidate/:id/add-payment"
                element={<AddPaymentPage />}
            />

            <Route
                path="/employee"
                element={<EmployeeHome />}
            />

            <Route
                path="/employee/profile"
                element={<EmployeeProfile />}
            />

            <Route
                path="/employee/documents/new"
                element={<CreateDocumentPage />}
            />

            <Route
                path="/employee/documents"
                element={<DocumentsPage />}
            />

            <Route
                path="/employee/documents/:id"
                element={<DocumentDetailsPage />}
            />


            <Route
                path="/employee/documents/:id/edit"
                element={<EditDocumentPage />}
            />

            <Route
                path="/employee/candidates"
                element={<CandidatesPage />}
            />
            <Route
                path="/employee/candidates/:candidateId/documents"
                element={<CandidateDocumentsPage />}
            />

        </Routes>

    );
}

export default App;