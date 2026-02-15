
import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 ml-2 lg:ml-0">
              <h1 className="text-xl font-bold text-primary-600">
                Finance Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
