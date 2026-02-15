
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Target,
  Upload,
  Settings,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Balance', path: '/balance', icon: Wallet },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Plans', path: '/plans', icon: Target },
    { name: 'Import', path: '/import', icon: Upload },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 lg:translate-x-0`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};