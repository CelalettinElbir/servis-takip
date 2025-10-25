import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTools, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ onLogout }) => {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            <div className="text-2xl font-bold p-4 border-b border-gray-700">
                Servis Takip
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `block py-2.5 px-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''
                        }`
                    }
                >
                    <FaHome className="inline mr-2" /> Dashboard
                </NavLink>

                <NavLink
                    to="/servis-kayitlari"
                    className={({ isActive }) =>
                        `block py-2.5 px-4 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''
                        }`
                    }
                >
                    <FaTools className="inline mr-2" /> Servis Kayıtları
                </NavLink>
            </nav>

            <button
                onClick={onLogout}
                className="p-4 text-left border-t border-gray-700 hover:bg-gray-700"
            >
                <FaSignOutAlt className="inline mr-2" /> Çıkış Yap
            </button>
        </div>


    );
};

export default Sidebar;