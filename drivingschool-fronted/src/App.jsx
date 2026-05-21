import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminProfile from "./pages/Admin/AdminDashboard";
import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Candidates from "./pages/Admin/Candidates";
import CandidateDetails from "./pages/Admin/CandidateDetails";
import AddPaymentPage from "./pages/Admin/AddPaymentPage";


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

        </Routes>


    );
}

export default App;