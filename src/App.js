import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LoginForm from './features/auth/LoginForm';
import { AdminRoutes } from './features/admin/routes';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
  
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
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute role="Admin">
                <AdminRoutes />
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