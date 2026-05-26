import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminProfile from "./pages/Admin/AdminDashboard";
import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Candidates from "./pages/Admin/Candidates";
import CandidateDetails from "./pages/Admin/CandidateDetails";
import AddPaymentPage from "./pages/Admin/AddPaymentPage";
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

                // Admin routes
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

                // Candidate routes
                <Route
                    path="/candidate"
                    element={<CandidateDashboard />}
                />

                <Route
                    path="/candidate/theory-schedule"
                    element={<CandidateTheorySchedule />}
                />

                // Professor routes
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

        </Routes>


    );
}

export default App;