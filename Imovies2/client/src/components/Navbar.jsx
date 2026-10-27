import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LuminaLogo from './LuminaLogo';
import {
  Ticket,
  User as UserIcon,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  MapPin,
  Film,
  Compass,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-2 py-lg-3">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center me-4">
          <LuminaLogo size="md" />
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ filter: 'invert(1)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                  isActive('/')
                    ? 'text-white fw-bold bg-white bg-opacity-10'
                    : 'text-secondary hover-white'
                }`}
                style={{ fontSize: '0.92rem' }}
              >
                <Film size={16} className={isActive('/') ? 'text-emerald' : ''} />
                Now Playing
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/movies"
                className={`nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                  isActive('/movies')
                    ? 'text-white fw-bold bg-white bg-opacity-10'
                    : 'text-secondary hover-white'
                }`}
                style={{ fontSize: '0.92rem' }}
              >
                <Compass size={16} className={isActive('/movies') ? 'text-emerald' : ''} />
                Catalogue
              </Link>
            </li>

            {/* City Badge Pill */}
            <li className="nav-item ms-lg-2 my-2 my-lg-0">
              <div
                className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill small"
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: 'var(--emerald-light)',
                  fontSize: '0.78rem',
                }}
              >
                <MapPin size={12} />
                <span>{selectedCity} NCR</span>
              </div>
            </li>

            {isAdmin && (
              <li className="nav-item ms-lg-2">
                <Link
                  to="/admin"
                  className="nav-link px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                  style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: 'var(--amber-gold)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                  }}
                >
                  <Shield size={14} /> Admin Console
                </Link>
              </li>
            )}
          </ul>

          {/* User actions */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-lumina-outline dropdown-toggle d-flex align-items-center gap-2 py-2 px-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ borderRadius: 14 }}
                >
                  {/* Avatar badge */}
                  <div
                    className="d-flex align-items-center justify-content-center fw-bold text-dark rounded-circle"
                    style={{
                      width: 26,
                      height: 26,
                      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="fw-semibold text-white small">{user?.name || 'Account'}</span>
                  {isAdmin && (
                    <span
                      className="badge ms-1"
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: 'var(--amber-gold)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        fontSize: '0.62rem',
                      }}
                    >
                      ADMIN
                    </span>
                  )}
                  <ChevronDown size={14} className="text-secondary" />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg py-2 mt-2"
                  aria-labelledby="userDropdown"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 16,
                    minWidth: 220,
                  }}
                >
                  <li className="px-3 py-2 border-bottom border-secondary border-opacity-10 mb-1">
                    <p className="text-white fw-bold mb-0 small">{user?.name}</p>
                    <p className="text-secondary small mb-0 text-truncate">{user?.email}</p>
                  </li>
                  <li>
                    <Link
                      to="/my-bookings"
                      className="dropdown-item d-flex align-items-center gap-2 text-white py-2"
                      style={{ fontSize: '0.88rem' }}
                    >
                      <Ticket size={16} className="text-emerald" />
                      My Digital Passes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item d-flex align-items-center gap-2 text-white py-2"
                      style={{ fontSize: '0.88rem' }}
                    >
                      <UserIcon size={16} className="text-secondary" />
                      Account Settings
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider border-secondary opacity-15" /></li>
                      <li>
                        <Link
                          to="/admin"
                          className="dropdown-item d-flex align-items-center gap-2 py-2"
                          style={{ color: 'var(--amber-gold)', fontSize: '0.88rem' }}
                        >
                          <Shield size={16} />
                          Operator Console
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider border-secondary opacity-15" /></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item d-flex align-items-center gap-2 text-danger py-2 w-100 border-0 bg-transparent"
                      style={{ fontSize: '0.88rem' }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-lumina-outline py-2 px-3 small">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-lumina py-2 px-3 small">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
