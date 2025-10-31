import { useContext } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layout/DashboardLayout";
import Services from "../pages/Services";
import ServiceDetail from "../pages/ServiceDetail";
import NewDashboard from "../layout/NewDashboard";
import ServiceNew from "../pages/ServiceNew"
import Users from "../pages/users"

// 🔒 PrivateRoute: sadece giriş yapılmış kullanıcıları içeri alır
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Giriş ve kayıt sayfaları */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout içinde çalışacak korumalı sayfalar */}
      <Route
        element={
          <PrivateRoute>
            <NewDashboard />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services">
          <Route index element={<Services />} />
          <Route path="new" element={<ServiceNew/> }/>
          <Route path=":id" element={<ServiceDetail />} />
        </Route>
        <Route path="/users" element={<Users />} />
        {/* <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} /> */}
      </Route>

      {/* Eşleşmeyen tüm yollar login'e yönlensin */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
