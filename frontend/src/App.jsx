
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
// import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Plans } from './pages/Plans';
import { Import } from './pages/Import';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Balance } from './pages/Balance';
import { useAuthStore } from './store/authStore';
import { Dashboard } from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/balance"
          element={
            <PrivateRoute>
              <Layout>
                <Balance />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Layout>
                <Expenses />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <PrivateRoute>
              <Layout>
                <Plans />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/import"
          element={
            <PrivateRoute>
              <Layout>
                <Import />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;