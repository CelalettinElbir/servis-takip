import React from 'react';
import {
BrowserRouter as Router,
Routes,
Route,
Navigate,
Outlet,
} from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout  from './layout/Dashboardlayout';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';

// 🔒 PrivateRoute: sadece giriş yapılmış kullanıcıları içeri alır
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
const { token } = React.useContext(AuthContext);
return token ? children : <Navigate to="/login" replace />;
};

function App() {
return (
<AuthProvider>
<Router>
<Routes>
{/* Giriş ve kayıt sayfaları (layout dışı) */}
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

      {/* Layout içinde çalışacak korumalı sayfalar */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Service/:id" element={<ServiceDetail />} />
      </Route>

      {/* Herhangi bir eşleşmeyen route login'e yönlensin */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
</AuthProvider>


);
}

export default App;