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
import AlertsPage from "./pages/Employee/AlertsPage";
import ProfessorDashboard from "./pages/Professor/ProfessorDashboard";
import ProfessorSchedule from "./pages/Professor/ProfessorSchedule";
import ProfessorClassDetails from "./pages/Professor/ProfessorClassDetails";
import ProfessorMyAvailability from "./pages/Professor/ProfessorMyAvailability";
import TheorySchedulePage from "./pages/Admin/TheorySchedulePage";
import CandidateTheorySchedule from "./pages/Candidate/CandidateTheorySchedule";
import TheoryScheduleView from "./pages/Admin/TheoryScheduleView";
import Vehicles from "./pages/Admin/Vehicles";
import Instructors from "./pages/Admin/Instructors";
import InstructorProfile from "./pages/Instructor/InstructorDashboard";
import InstructorVehicles from "./pages/Instructor/InstructorVehicles";
import CandidateNotifications from "./pages/Candidate/CandidateNotifications";
import CandidateFinancials from "./pages/Candidate/CandidateFinancials";
import CandidateTheorySimulation from "./pages/Candidate/CandidateTheorySimulation";
import CandidateTheoryExam from "./pages/Candidate/CandidateTheoryExam";
import InstructorCandidates from "./pages/Instructor/InstructorCandidates";

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Login />}
            />
            
            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/admin/profile"
                element={<AdminProfile />}
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
                path="/admin/theory-schedule"
                element={<TheorySchedulePage />}
            />

            <Route
                path="/admin/theory-schedule-view"
                element={<TheoryScheduleView />}
            />

            <Route
                path="/candidate"
                element={<CandidateDashboard />}
            />

            <Route
                path="/candidate/theory-schedule"
                element={<CandidateTheorySchedule />}
            />

            
            <Route
                path="/candidate/theory-simulation"
                element={<CandidateTheorySimulation />}
            />

            <Route
                path="/candidate/theory-exam"
                element={<CandidateTheoryExam />}
            />

            <Route
                path="/professor/dashboard"
                element={<ProfessorDashboard />}
            />

            <Route
                path="/professor/schedule"
                element={<ProfessorSchedule />}
            />

            <Route
                path="/professor/class-details/:theoryId"
                element={<ProfessorClassDetails />}
            />

            <Route
                path="/professor/availability"
                element={<ProfessorMyAvailability />}
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

            <Route
                path="/employee/alerts"
                element={<AlertsPage />}
            />

                <Route 
                    path="/admin/vehicles" 
                    element={<Vehicles />} />

                <Route 
                    path="/admin/instructors" 
                    element={<Instructors />} />

                // Instructor routes
                <Route
                    path="/instructor/profile"
                    element={<InstructorProfile />}
                />

                <Route
                    path="/instructor/vehicles"
                    element={<InstructorVehicles />}
                />

                <Route
                    path="/instructor/candidates"
                    element={<InstructorCandidates />}
                />

                <Route
                    path="/candidate/notifications"
                    element={<CandidateNotifications />}
                />

                <Route
                    path="/candidate/financials"
                    element={<CandidateFinancials />}
                />

        </Routes>

    );
}

export default App;