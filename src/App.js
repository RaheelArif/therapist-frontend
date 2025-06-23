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
import InitializeApp from "./components/shared/InitializeApp";
import TherapistLayout from "./features/therapist/components/TherapistLayout";
import TherapistDashboard from "./features/therapist/TherapistDashboard";
import AppointmentConfirmation from "./features/appointmentConfirmation/AppointmentConfirmation";
import PublicClientForm from "./features/admin/pages/Clients/components/PublicClientForm";
import OfflineDateManager from "./features/admin/pages/OfflineDateManager";

// Import Ant Design's ConfigProvider and your themes
import { ConfigProvider } from 'antd';
import { publicTheme, adminTheme, therapistTheme } from './themes'; // Ensure this path is correct

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    // Redirect to the user's actual role dashboard or a generic access denied page
    const userDashboardPath = userRole ? `/${userRole.toLowerCase()}` : '/login';
    return <Navigate to={userDashboardPath} />;
  }

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* Apply publicTheme as the default theme for the entire application */}
        {/* Specific layouts (AdminLayout, TherapistLayout) will override this with their own ConfigProvider */}
        <ConfigProvider theme={publicTheme}>
          <InitializeApp />
          <Routes>
            {/* Public Routes - will use publicTheme by default */}
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/confirm-appointment/:appointmentId"
              element={<AppointmentConfirmation />}
            />
            <Route path="/add-client" element={<PublicClientForm />} />

            {/* Admin Routes - AdminLayout will apply adminTheme */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute role="Admin">
                  {/* AdminRoutes likely renders AdminLayout internally, or AdminLayout wraps its content */}
                  <AdminRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/offline-dates"
              element={
                <PrivateRoute role="Admin">
                  <AdminLayout> {/* AdminLayout itself contains ConfigProvider for adminTheme */}
                    <OfflineDateManager />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Therapist Routes - TherapistLayout will apply therapistTheme */}
            <Route
              path="/therapist"
              element={
                <PrivateRoute role="Therapist">
                  <TherapistLayout> {/* TherapistLayout itself contains ConfigProvider for therapistTheme */}
                    <TherapistDashboard />
                  </TherapistLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/therapist/*" // Example: If therapist has more sub-routes within TherapistLayout
              element={
                <PrivateRoute role="Therapist">
                  <TherapistLayout>
                    {/* Define nested routes for therapist here or in a TherapistRoutes component */}
                    {/* e.g., <Route path="dashboard" element={<TherapistDashboard />} /> */}
                    {/* <Route path="clients" element={<TherapistClients />} /> */}
                    <Routes> {/* Nested Routes example */}
                        <Route index element={<TherapistDashboard />} /> {/* Default for /therapist */}
                        {/* Add other therapist sub-routes here */}
                    </Routes>
                  </TherapistLayout>
                </PrivateRoute>
              }
            />


            {/* Profile Route - will use AdminLayout, thus adminTheme */}
            <Route
              path="/profile"
              element={
                <PrivateRoute> {/* No specific role, accessible by any authenticated user */}
                                  {/* The layout choice here determines the theme. */}
                                  {/* If a therapist views their profile, and you want therapistTheme, */}
                                  {/* you might need a more dynamic layout or separate profile routes */}
                  <AdminLayout> {/* AdminLayout itself contains ConfigProvider for adminTheme */}
                    <Profile />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* You might want a 404 Not Found Route here */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

// "email": admin@example.com
//   "password": securePassword123
//tp = SecurePass123
