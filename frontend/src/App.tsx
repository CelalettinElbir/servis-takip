import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from "./pages/Login"
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import React from 'react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export default App;
