import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
const { logout } = useContext(AuthContext);
const navigate = useNavigate();

const handleLogout = () => {
logout();
navigate('/');
};

return (
<div className="flex min-h-screen bg-gray-100">
<Sidebar onLogout={handleLogout} />
<div className="flex-1 p-6">
<Outlet /> {/* burada alt sayfalar render edilir */}
</div>
</div>
);
};

export default DashboardLayout;