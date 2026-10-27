import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showApi } from '../api/showApi';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  AlertCircle,
  Ticket,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const SeatSelection = () => {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch show details
  const fetchShowData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setIsRefreshing(true);

      const res = await showApi.getShowById(showId);
      if (res.success && res.data) {
        setShow(res.data);

        // Deselect any seat that has become booked or locked by someone else
        setSelectedSeats((prevSelected) => {
          const validSeats = prevSelected.filter((seatId) => {
            const foundSeat = res.data.seats.find((s) => s.seatId === seatId);
            if (!foundSeat) return false;
            if (foundSeat.status === 'booked') return false;
            if (
              foundSeat.status === 'locked' &&
              foundSeat.lockedBy &&
              foundSeat.lockedBy !== user?._id
            ) {
              return false;
            }
            return true;
          });
          return validSeats;
        });
      }
    } catch (err) {
      console.error('Error fetching show seat map:', err);
      setErrorMessage('Failed to load auditorium layout. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShowData();

    // Poll every 5 seconds for live updates
    const pollInterval = setInterval(() => {
      fetchShowData(true);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [showId]);

  // Handle seat click toggle (up to 8 seats)
  const handleSeatToggle = (seat) => {
    setErrorMessage('');
    const seatId = seat.seatId;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMessage('You can select a maximum of 8 seats per reservation.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Calculate running total
  const calculateTotal = () => {
    if (!show || selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((sum, seatId) => {
      const seat = show.seats.find((s) => s.seatId === seatId);
      const price = show.prices?.[seat?.category] || 150;
      return sum + price;
    }, 0);
  };

  // Handle seat lock and proceed
  const handleProceedToCheckout = async () => {
    if (selectedSeats.length === 0) return;

    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: `/shows/${showId}/seats` } },
      });
      return;
    }

    try {
      setLocking(true);
      setErrorMessage('');

      const res = await showApi.lockSeats(showId, selectedSeats);

      if (res.success) {
        navigate('/checkout', {
          state: {
            showId,
            show,
            selectedSeats,
            lockExpiresAt: res.lockExpiresAt,
            totalAmount: calculateTotal(),
          },
        });
      }
    } catch (err) {
      const respData = err.response?.data;
      if (respData && respData.unavailable) {
        setErrorMessage(
          `Some seats were claimed in the meantime: ${respData.unavailable.join(
            ', '
          )}. Please select alternative seats.`
        );
        fetchShowData(true);
      } else {
        setErrorMessage(respData?.message || 'Failed to lock seats. Please try again.');
      }
    } finally {
      setLocking(false);
    }
  };

  if (loading && !show) {
    return (
      <div className="text-center py-5 my-5">
        <div
          className="spinner-border"
          role="status"
          style={{ color: 'var(--emerald-primary)' }}
        />
        <p className="text-secondary small mt-3">Initializing auditorium map...</p>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5>Show details not found.</h5>
        <Link to="/movies" className="btn btn-lumina mt-3">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const movie = show.movieId;
  const screen = show.screenId;
  const theatre = screen?.theatreId;

  const formattedDate = new Date(show.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = new Date(show.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="seat-selection-page pb-5">
      {/* Show Header Ribbon */}
      <div className="glass-nav py-3 px-4 mb-4">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <Link
                to={`/movies/${movie?._id}`}
                className="btn btn-lumina-outline btn-sm p-2 d-flex align-items-center justify-content-center"
              >
                <ChevronLeft size={18} />
              </Link>
              <div>
                <h4
                  className="text-white fw-bold m-0"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {movie?.title}
                </h4>
                <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mt-1">
                  <span className="d-flex align-items-center gap-1">
                    <MapPin size={13} className="text-emerald" />
                    <span>
                      {theatre?.name} &bull; {screen?.name}
                    </span>
                  </span>
                  <span>&bull;</span>
                  <span className="d-flex align-items-center gap-1 text-light">
                    <Calendar size={13} /> {formattedDate}
                  </span>
                  <span>&bull;</span>
                  <span className="d-flex align-items-center gap-1 text-light">
                    <Clock size={13} /> {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small"
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: 'var(--emerald-light)',
                  fontSize: '0.78rem',
                }}
              >
                <ShieldCheck size={14} />
                <span>Atomic Concurrency Hold</span>
              </span>
              {isRefreshing && (
                <span className="text-secondary small d-flex align-items-center gap-1 ms-2">
                  <RefreshCw size={12} className="spin" /> Syncing...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Error notification */}
        {errorMessage && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3"
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Seat Map Glass Container */}
        <div className="glass-panel p-4 mb-5">
          <SeatGrid
            seats={show.seats || []}
            prices={show.prices || {}}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            currentUserId={user?._id}
          />
        </div>
      </div>

      {/* Floating Bottom Dock when seats are selected */}
      {selectedSeats.length > 0 && (
        <div
          className="position-fixed bottom-0 start-0 w-100 p-3 shadow-lg"
          style={{
            background: 'rgba(8, 12, 20, 0.94)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(16, 185, 129, 0.3)',
            zIndex: 1000,
          }}
        >
          <div className="container">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
              <div>
                <div className="small text-secondary mb-1">
                  Selected Seats ({selectedSeats.length} / 8 max):
                </div>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {selectedSeats.map((s) => (
                    <span
                      key={s}
                      className="badge px-3 py-1 fw-bold"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        borderRadius: 8,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                  <span className="text-secondary ms-2">&bull;</span>
                  <span className="text-white fw-bold ms-2 fs-5">
                    Subtotal: ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={locking}
                className="btn btn-lumina btn-lg px-4 py-2"
              >
                {locking ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    <span>Isolating Seats...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
