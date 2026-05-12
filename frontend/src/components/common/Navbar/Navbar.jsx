import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FiUser } from 'react-icons/fi';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Membership', path: '/membership' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full h-[70px] bg-[#0A0F1E] text-white z-50 top-0 left-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
            {/* Fallback image, real image will be added later */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
              CXO
            </div>
            <span className="font-bold text-xl tracking-wide">CXO Global Alliance</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition-colors duration-200 hover:text-blue-400 ${
                  isActive ? 'text-blue-500 font-semibold border-b-2 border-blue-500 pb-1' : 'text-gray-300'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Auth Section Desktop */}
          <div className="ml-4 border-l border-gray-700 pl-4 relative">
            {!user ? (
              <Link
                to="/login"
                className="px-5 py-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition-all duration-300 font-medium"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-700 transition">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : <FiUser />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 border border-gray-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
          >
            {isOpen ? <RiCloseLine className="h-7 w-7" /> : <RiMenu3Line className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0F172A] border-t border-gray-800 absolute w-full left-0 shadow-xl transition-all duration-300 ease-in-out">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md text-base font-medium ${
                    isActive ? 'bg-blue-900/50 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Auth Section Mobile */}
            <div className="pt-4 mt-2 border-t border-gray-800">
              {!user ? (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block w-full text-center px-4 py-3 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-md transition-all duration-300 font-medium"
                >
                  Login
                </Link>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center px-3 py-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name ? user.name.charAt(0).toUpperCase() : <FiUser />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-medium text-white">{user.name || 'User'}</div>
                      <div className="text-sm font-medium text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
