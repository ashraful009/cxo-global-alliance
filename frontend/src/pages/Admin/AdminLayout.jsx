import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  FiGrid, FiImage, FiCalendar, FiLayers, FiBriefcase,
  FiUsers, FiMail, FiSettings, FiLogOut, FiMenu, FiX,
  FiExternalLink
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/admin',           label: 'Dashboard',  icon: <FiGrid /> },
  { to: '/admin/hero',      label: 'Hero',        icon: <FiImage /> },
  { to: '/admin/events',    label: 'Events',      icon: <FiCalendar /> },
  { to: '/admin/facilities',label: 'Facilities',  icon: <FiLayers /> },
  { to: '/admin/services',  label: 'Services',    icon: <FiBriefcase /> },
  { to: '/admin/users',     label: 'Users',       icon: <FiUsers /> },
  { to: '/admin/messages',  label: 'Messages',    icon: <FiMail /> },
  { to: '/admin/settings',  label: 'Settings',    icon: <FiSettings /> },
];

const SidebarContent = ({ onLinkClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-700/60 flex-shrink-0">
        <span className="text-white font-bold text-lg tracking-tight">CXO</span>
        <span className="text-blue-400 font-bold text-lg"> Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/admin'}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                   ${isActive
                     ? 'bg-blue-600 text-white'
                     : 'text-gray-400 hover:text-white hover:bg-gray-700/60'}`
                }
              >
                <span className="text-base">{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-700/60 flex-shrink-0 space-y-2">
        {user && (
          <div className="px-3 py-2">
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
        )}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400
                     hover:text-white hover:bg-gray-700/60 transition-colors w-full"
        >
          <FiExternalLink size={14} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400
                     hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <FiLogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[250px] flex-shrink-0 bg-gray-900 border-r border-gray-700/60 fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[250px] bg-gray-900 border-r border-gray-700/60
                    z-50 flex flex-col transform transition-transform duration-300 lg:hidden
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white p-1"
          >
            <FiX size={20} />
          </button>
        </div>
        <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[250px]">
        {/* Topbar (mobile only) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-700/60 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white p-1"
          >
            <FiMenu size={22} />
          </button>
          <span className="text-white font-bold text-base">CXO <span className="text-blue-400">Admin</span></span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
