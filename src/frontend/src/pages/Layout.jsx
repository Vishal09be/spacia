import React from "react";
import { Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import avatar from '../assets/avatar.webp';
import webicon from '../assets/spacia.png';
import { APP_NAME } from '../utils/constants';
import { FiHome, FiSearch, FiPlusCircle, FiLogOut } from 'react-icons/fi';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  if (user && (currentPath === '/login' || currentPath === '/register')) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF2E9] via-white to-[#FAE5D3]">
      {/* Premium Navigation */}
      <header className="bg-white shadow-md backdrop-blur-lg bg-opacity-90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Primary Navigation */}
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2 group">
                  <img src={webicon} alt="Logo" className="h-10 w-10 transition-transform group-hover:scale-105" />
                  <span className="text-xl font-bold text-gray-900 group-hover:text-[#E67E22] transition-colors">
                    {APP_NAME}
                  </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-gray-600 hover:text-[#E67E22] transition-colors px-3 py-2 rounded-lg hover:bg-[#FDF2E9]"
                  >
                    <FiHome className="w-5 h-5" />
                    <span className="font-medium">Home</span>
                  </Link>

                  <Link
                    to="/properties"
                    className="flex items-center space-x-2 text-gray-600 hover:text-[#E67E22] transition-colors px-3 py-2 rounded-lg hover:bg-[#FDF2E9]"
                  >
                    <FiSearch className="w-5 h-5" />
                    <span className="font-medium">Browse Properties</span>
                  </Link>

                  {user && (
                    <Link
                      to="/my-properties"
                      className="flex items-center space-x-2 text-gray-600 hover:text-[#E67E22] transition-colors px-3 py-2 rounded-lg hover:bg-[#FDF2E9]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <span className="font-medium">My Properties</span>
                    </Link>
                  )}
                </nav>
              </div>

              {/* Auth Section */}
              <div className="flex items-center space-x-6">
                {!user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-[#E67E22] font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-[#E67E22] text-white px-6 py-2 rounded-xl hover:bg-[#D35400] transition-colors flex items-center space-x-2"
                    >
                      <FiPlusCircle className="w-5 h-5" />
                      <span>List Your Property</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-6">
                    <Link
                      to="/add-property"
                      className="bg-[#E67E22] text-white px-6 py-2 rounded-xl hover:bg-[#D35400] transition-colors flex items-center space-x-2"
                    >
                      <FiPlusCircle className="w-5 h-5" />
                      <span>List New Property</span>
                    </Link>

                    <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-50">
                      <img src={avatar} alt="Profile" className="w-8 h-8 rounded-full border-2 border-[#E67E22]" />
                      <span className="text-sm font-medium text-gray-700">{user.username}</span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-red-600 transition-colors flex items-center space-x-2"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src={webicon} alt="Logo" className="h-10 w-10 brightness-200" />
                <span className="text-xl font-bold text-white">{APP_NAME}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted partner in finding the perfect home. Whether you're looking to rent or list your property, we've got you covered.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-[#E67E22] transition-colors">Home</Link></li>
                <li><Link to="/properties" className="text-gray-400 hover:text-[#E67E22] transition-colors">Browse Properties</Link></li>
                <li><Link to="/list-property" className="text-gray-400 hover:text-[#E67E22] transition-colors">List Your Property</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-[#E67E22] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Property Types</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/properties/apartments" className="text-gray-400 hover:text-[#E67E22] transition-colors">Apartments</Link></li>
                <li><Link to="/properties/houses" className="text-gray-400 hover:text-[#E67E22] transition-colors">Houses</Link></li>
                <li><Link to="/properties/villas" className="text-gray-400 hover:text-[#E67E22] transition-colors">Villas</Link></li>
                <li><Link to="/properties/commercial" className="text-gray-400 hover:text-[#E67E22] transition-colors">Commercial</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 234 567 890</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@{APP_NAME.toLowerCase()}.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
