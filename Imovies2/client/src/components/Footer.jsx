import React from 'react';
import { Link } from 'react-router-dom';
import LuminaLogo from './LuminaLogo';
import {
  ShieldCheck,
  Zap,
  Award,
  Circle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="mt-auto border-top border-secondary border-opacity-10 py-5"
      style={{ background: '#060910' }}
    >
      <div className="container">
        <div className="row g-4 justify-content-between">
          {/* Brand & Mission */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-3">
              <LuminaLogo size="md" showTagline={true} />
            </div>
            <p className="text-secondary small mb-3" style={{ maxWidth: 360, lineHeight: 1.6 }}>
              The next-generation cinema reservation platform. Featuring atomic seat locking,
              real-time 5-minute checkout holds, and contactless QR digital boarding passes.
            </p>

            {/* System Status Pill */}
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small"
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: 'var(--emerald-light)',
                fontSize: '0.75rem',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--emerald-primary)',
                  boxShadow: '0 0 8px var(--emerald-primary)',
                  display: 'inline-block',
                }}
              />
              <span>All Screen Systems Operational</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6
              className="text-white fw-bold mb-3 small text-uppercase"
              style={{ letterSpacing: '0.5px' }}
            >
              Cinema Catalogue
            </h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/" className="text-decoration-none text-secondary hover-white">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link
                  to="/movies?status=coming_soon"
                  className="text-decoration-none text-secondary hover-white"
                >
                  Upcoming Premieres
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-decoration-none text-secondary hover-white">
                  Complete Lineup
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-decoration-none text-secondary hover-white">
                  My Boarding Passes
                </Link>
              </li>
            </ul>
          </div>

          {/* Precision Features */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6
              className="text-white fw-bold mb-3 small text-uppercase"
              style={{ letterSpacing: '0.5px' }}
            >
              Lumina Standards
            </h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center gap-2">
                <ShieldCheck size={15} color="var(--emerald-primary)" />
                <span>Zero Double-Booking Guarantee</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Zap size={15} color="var(--amber-gold)" />
                <span>Atomic Concurrency Lock</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Award size={15} color="var(--ice-cyan)" />
                <span>IMAX Laser & Dolby Atmos 4K</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-10" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small gap-2">
          <div>
            &copy; {new Date().getFullYear()} Lumina Screens Inc. Nordic Slate Architecture.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-dark border border-secondary border-opacity-25 text-secondary">
              Stateless JWT
            </span>
            <span className="badge bg-dark border border-secondary border-opacity-25 text-secondary">
              Atomic MongoDB 8
            </span>
            <span className="badge bg-dark border border-secondary border-opacity-25 text-emerald-light">
              Lumina UI v2.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
