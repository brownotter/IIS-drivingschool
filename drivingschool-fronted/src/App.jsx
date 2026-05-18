import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Register from "./pages/Register";

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
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/candidate"
                    element={<CandidateDashboard />}
                />

                <Route
                    path="/instructor"
                    element={<InstructorDashboard />}
                />

                <Route
                    path="/professor"
                    element={<ProfessorDashboard />}
                />

                <Route
                    path="/employee"
                    element={<EmployeeDashboard />}
                />



        </Routes>

    );
}

export default App;