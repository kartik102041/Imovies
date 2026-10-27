import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getMyBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const now = new Date();

  // Filter bookings into Upcoming vs Past/Cancelled
  const upcomingBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const startTime = new Date(b.showId?.startTime);
    return startTime > now;
  });

  const pastBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return true;
    const startTime = new Date(b.showId?.startTime);
    return startTime <= now;
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  // Handle cancellation
  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this booking? This will immediately free your seats.'
      )
    ) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setActionError('');
      setActionSuccess('');

      const res = await bookingApi.cancelBooking(bookingId);
      if (res.success) {
        setActionSuccess('Booking cancelled successfully and seats have been released.');
        fetchBookings();
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          'Failed to cancel booking. Notice: Bookings can only be cancelled up to 2 hours before showtime.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Check if booking is cancelable (>= 2 hours before showtime)
  const isCancelable = (booking) => {
    if (booking.status === 'cancelled') return false;
    if (!booking.showId?.startTime) return false;
    const showTime = new Date(booking.showId.startTime).getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    return showTime - Date.now() >= twoHoursInMs;
  };

  return (
    <div className="my-bookings-page py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 text-emerald-light fw-bold small text-uppercase mb-1">
              <Sparkles size={14} />
              <span>Digital Vault</span>
            </div>
            <h2 className="text-white fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
              My Boarding Passes
            </h2>
            <p className="text-secondary small m-0 mt-1">
              Review your active admission vouchers, scan codes, or cancel reservations.
            </p>
          </div>

          {/* Tab Selector */}
          <div
            className="d-flex p-1 rounded-pill"
            style={{
              background: 'rgba(15, 22, 35, 0.85)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              className={`filter-chip ${activeTab === 'upcoming' ? 'active' : ''}`}
              style={{ border: 'none', padding: '6px 18px' }}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              className={`filter-chip ${activeTab === 'past' ? 'active' : ''}`}
              style={{ border: 'none', padding: '6px 18px' }}
              onClick={() => setActiveTab('past')}
            >
              Past & Cancelled ({pastBookings.length})
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3">
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3">
            <AlertTriangle size={18} />
            <span>{actionError}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5 my-5">
            <div
              className="spinner-border"
              role="status"
              style={{ color: 'var(--emerald-primary)' }}
            />
            <p className="text-secondary small mt-2">Loading reservation history...</p>
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            <h5>No {activeTab} passes found.</h5>
            <p className="small mb-4">You have no active admissions under this section.</p>
            <Link to="/movies" className="btn btn-lumina">
              Explore Now Playing
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {displayedBookings.map((b) => {
              const show = b.showId;
              const movie = show?.movieId;
              const screen = show?.screenId;
              const theatre = screen?.theatreId;

              const showDate = show?.startTime
                ? new Date(show.startTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A';

              const showTime = show?.startTime
                ? new Date(show.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A';

              const canCancel = isCancelable(b);

              return (
                <div key={b._id} className="glass-panel p-4">
                  <div className="row g-3 align-items-center">
                    {/* Poster */}
                    <div className="col-sm-3 col-md-2 text-center text-sm-start">
                      <img
                        src={movie?.posterUrl}
                        alt={movie?.title}
                        className="rounded-3 shadow-sm w-100"
                        style={{
                          maxWidth: 110,
                          aspectRatio: '2/3',
                          objectFit: 'cover',
                          border: '1px solid var(--border-subtle)',
                        }}
                      />
                    </div>

                    {/* Movie & Show Info */}
                    <div className="col-sm-9 col-md-6">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span
                          className="text-secondary small fw-bold"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          REF: {b.reference}
                        </span>
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
                            fontSize: '0.72rem',
                          }}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </div>

                      <h5
                        className="text-white fw-bold mb-1"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {movie?.title}
                      </h5>
                      <p className="text-secondary small mb-2 d-flex align-items-center gap-1">
                        <MapPin size={13} style={{ color: 'var(--amber-gold)' }} />
                        <span>
                          {theatre?.name} ({screen?.name})
                        </span>
                      </p>

                      <div className="d-flex flex-wrap gap-3 text-light small mb-2">
                        <span className="d-flex align-items-center gap-1">
                          <Calendar size={13} className="text-secondary" /> {showDate}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <Clock size={13} className="text-secondary" /> {showTime}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="text-secondary small">Seats:</span>
                        {b.seats?.map((seat) => (
                          <span
                            key={seat}
                            className="badge"
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: 'var(--emerald-light)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              fontSize: '0.78rem',
                            }}
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="col-md-4 text-md-end d-flex flex-column align-items-md-end justify-content-between gap-3">
                      <div>
                        <span className="text-secondary small d-block">Fare Paid</span>
                        <h4
                          className="text-white fw-bold m-0"
                          style={{
                            color: 'var(--emerald-light)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          ₹{b.totalAmount?.toLocaleString()}
                        </h4>
                      </div>

                      <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        <Link
                          to={`/bookings/${b._id}`}
                          className="btn btn-lumina btn-sm d-flex align-items-center gap-1"
                        >
                          <Eye size={14} />
                          <span>View Digital Pass</span>
                        </Link>

                        {canCancel && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            disabled={cancellingId === b._id}
                            className="btn btn-outline-danger btn-sm"
                            title="Cancel booking (allowed up to 2 hours before showtime)"
                          >
                            {cancellingId === b._id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              ></span>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
