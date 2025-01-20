// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import LoginForm from "./features/auth/LoginForm";
import { AdminRoutes } from "./features/admin/routes";
import Profile from "./features/common/Profile";
import { useSelector } from "react-redux";
import "./App.css";
import AdminLayout from "./features/admin/AdminLayout";
import InitializeApp from './components/shared/InitializeApp';
import TherapistLayout from "./features/therapist/components/TherapistLayout";
import TherapistDashboard from "./features/therapist/TherapistDashboard";
import AppointmentConfirmation from "./features/appointmentConfirmation/AppointmentConfirmation";
import PublicClientForm from "./features/admin/pages/Clients/components/PublicClientForm"; // Import the new component


const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    return <Navigate to={`/${userRole.toLowerCase()}`} />;
  }

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <InitializeApp />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/confirm-appointment/:appointmentId" 
            element={<AppointmentConfirmation />} 
          />
   
          <Route path="/add-client" element={<PublicClientForm />} />

          <Route
            path="/admin/*"
            element={
              <PrivateRoute role="Admin">
                <AdminRoutes />
              </PrivateRoute>
            }
          />
           <Route
            path="/therapist"
            element={
              <PrivateRoute role="Therapist">
                <TherapistLayout>
                  <TherapistDashboard />
                </TherapistLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Profile />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

// "email": admin@example.com 
//   "password": securePassword123