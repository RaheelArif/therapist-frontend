import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ClientsPage from './pages/Clients';
import TherapistsPage from './pages/Therapists';
import DashboardPage from './pages/Dashboard';
import AdminsPage from './pages/Admins';
import AddAppointmentPage from './pages/AddAppointments';

export const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/therapists" element={<TherapistsPage />} />
      <Route path="/admins" element={<AdminsPage />} />
      <Route path="/add-appointment" element={<AddAppointmentPage />} /> 
      {/* <Route path="/appointments" element={<AppointmentsPage />} /> */}
    </Routes>
  </AdminLayout>
);