import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import LuminaLogo from '../components/LuminaLogo';
import {
  LayoutDashboard,
  Film,
  Building2,
  CalendarDays,
  Ticket,
  Shield,
  Sparkles,
} from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="admin-layout py-4">
      <div className="container">
        {/* Admin Header */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-3">
            <LuminaLogo size="sm" />
            <div>
              <h4
                className="text-white fw-bold m-0"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.3px' }}
              >
                Multiplex Operations Console
              </h4>
              <p className="text-secondary small mb-0">
                Auditorium control, schedules, catalogue management & revenue ledger.
              </p>
            </div>
          </div>
          <span
            className="badge px-3 py-2 fw-bold text-uppercase d-inline-flex align-items-center gap-1"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--amber-gold)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: 10,
              fontSize: '0.75rem',
            }}
          >
            <Shield size={14} />
            <span>Operator Privileges</span>
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex gap-2 overflow-x-auto pb-2 mb-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-nowrap ${
                isActive ? 'btn-lumina fw-bold' : 'btn-lumina-outline text-secondary'
              }`
            }
          >
            <LayoutDashboard size={15} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/movies"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-nowrap ${
                isActive ? 'btn-lumina fw-bold' : 'btn-lumina-outline text-secondary'
              }`
            }
          >
            <Film size={15} /> Movies Catalogue
          </NavLink>

          <NavLink
            to="/admin/theatres"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-nowrap ${
                isActive ? 'btn-lumina fw-bold' : 'btn-lumina-outline text-secondary'
              }`
            }
          >
            <Building2 size={15} /> Theatres & Auditoriums
          </NavLink>

          <NavLink
            to="/admin/shows"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-nowrap ${
                isActive ? 'btn-lumina fw-bold' : 'btn-lumina-outline text-secondary'
              }`
            }
          >
            <CalendarDays size={15} /> Showtimes & Schedules
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-nowrap ${
                isActive ? 'btn-lumina fw-bold' : 'btn-lumina-outline text-secondary'
              }`
            }
          >
            <Ticket size={15} /> Transaction Ledger
          </NavLink>
        </div>

        {/* Child Admin Pages */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
