import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import {
  DollarSign,
  Ticket,
  Users,
  Film,
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div
          className="spinner-border"
          role="status"
          style={{ color: 'var(--emerald-primary)' }}
        />
        <p className="text-secondary small mt-2">Aggregating telemetry...</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalBookings = 0,
    confirmedBookings = 0,
    cancelledBookings = 0,
    totalUsers = 0,
    totalMovies = 0,
    topMovies = [],
    recentBookings = [],
  } = stats || {};

  return (
    <div className="admin-dashboard">
      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-sm-6">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span
                className="text-secondary small fw-bold text-uppercase"
                style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
              >
                Gross Box Office
              </span>
              <div
                className="p-2 rounded-3"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--emerald-light)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <DollarSign size={18} />
              </div>
            </div>
            <h3
              className="text-white fw-bold mb-1"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <span
              className="small d-flex align-items-center gap-1"
              style={{ color: 'var(--emerald-light)', fontSize: '0.78rem' }}
            >
              <TrendingUp size={13} /> Confirmed Admissions
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span
                className="text-secondary small fw-bold text-uppercase"
                style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
              >
                Total Passes Issued
              </span>
              <div
                className="p-2 rounded-3"
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: 'var(--ice-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                }}
              >
                <Ticket size={18} />
              </div>
            </div>
            <h3
              className="text-white fw-bold mb-1"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {confirmedBookings}
            </h3>
            <span className="text-secondary small" style={{ fontSize: '0.78rem' }}>
              {cancelledBookings} cancelled vouchers
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span
                className="text-secondary small fw-bold text-uppercase"
                style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
              >
                Active Premieres
              </span>
              <div
                className="p-2 rounded-3"
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--amber-gold)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <Film size={18} />
              </div>
            </div>
            <h3
              className="text-white fw-bold mb-1"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {totalMovies}
            </h3>
            <span className="text-secondary small" style={{ fontSize: '0.78rem' }}>
              Active in 3 Metro Regions
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span
                className="text-secondary small fw-bold text-uppercase"
                style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
              >
                Registered Cinephiles
              </span>
              <div
                className="p-2 rounded-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Users size={18} />
              </div>
            </div>
            <h3
              className="text-white fw-bold mb-1"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {totalUsers}
            </h3>
            <span className="text-secondary small" style={{ fontSize: '0.78rem' }}>
              Verified Accounts
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Top Movies Leaderboard */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Award size={18} style={{ color: 'var(--amber-gold)' }} />
              <h5 className="text-white fw-bold m-0" style={{ letterSpacing: '-0.3px' }}>
                Top Performing Premieres
              </h5>
            </div>

            {topMovies.length === 0 ? (
              <p className="text-secondary small">No sales telemetry recorded yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {topMovies.map((tm, idx) => (
                  <div
                    key={tm.movieId}
                    className="d-flex align-items-center justify-content-between p-2 rounded-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span
                        className="fw-bold"
                        style={{
                          width: 20,
                          color: idx === 0 ? 'var(--amber-gold)' : 'var(--text-muted)',
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <img
                        src={tm.posterUrl}
                        alt={tm.title}
                        className="rounded-2"
                        style={{ width: 36, height: 48, objectFit: 'cover' }}
                      />
                      <div>
                        <strong
                          className="text-white small d-block text-truncate"
                          style={{ maxWidth: 160 }}
                        >
                          {tm.title}
                        </strong>
                        <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
                          {tm.totalSeatsSold} seats reserved
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <span
                        className="fw-bold small d-block"
                        style={{
                          color: 'var(--emerald-light)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        ₹{tm.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="col-lg-7">
          <div className="glass-panel p-4 h-100">
            <h5 className="text-white fw-bold mb-3" style={{ letterSpacing: '-0.3px' }}>
              Recent Transactions
            </h5>

            {recentBookings.length === 0 ? (
              <p className="text-secondary small">No recent bookings recorded.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0 bg-transparent">
                  <thead>
                    <tr className="text-secondary small border-secondary border-opacity-25">
                      <th className="bg-transparent fw-semibold">REFERENCE</th>
                      <th className="bg-transparent fw-semibold">MOVIE</th>
                      <th className="bg-transparent fw-semibold">SEATS</th>
                      <th className="bg-transparent fw-semibold">AMOUNT</th>
                      <th className="bg-transparent fw-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b._id} className="border-secondary border-opacity-15 small">
                        <td
                          className="bg-transparent fw-bold"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {b.reference}
                        </td>
                        <td className="bg-transparent text-white text-truncate" style={{ maxWidth: 140 }}>
                          {b.showId?.movieId?.title || 'Unknown Movie'}
                        </td>
                        <td className="bg-transparent text-secondary">
                          {b.seats?.join(', ')}
                        </td>
                        <td
                          className="bg-transparent fw-bold"
                          style={{
                            color: 'var(--emerald-light)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          ₹{b.totalAmount?.toLocaleString()}
                        </td>
                        <td className="bg-transparent">
                          <span
                            className="badge px-2 py-1"
                            style={{
                              background:
                                b.status === 'confirmed'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                              color:
                                b.status === 'confirmed'
                                  ? 'var(--emerald-light)'
                                  : '#f87171',
                              border: `1px solid ${
                                b.status === 'confirmed'
                                  ? 'rgba(16, 185, 129, 0.3)'
                                  : 'rgba(239, 68, 68, 0.3)'
                              }`,
                              fontSize: '0.68rem',
                            }}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
