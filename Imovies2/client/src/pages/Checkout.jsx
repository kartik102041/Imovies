import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { showApi } from '../api/showApi';
import Timer from '../components/Timer';
import {
  CreditCard,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  MapPin,
  Lock,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { showId, show, selectedSeats, lockExpiresAt, totalAmount } =
    location.state || {};

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardData, setCardData] = useState({
    name: 'Parv Khandelwal',
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
  });

  // If page accessed directly without state, redirect to movies
  if (!showId || !selectedSeats || !show) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5>No active checkout session found.</h5>
        <p className="small mb-4">Please select a movie and seats first.</p>
        <Link to="/movies" className="btn btn-lumina">
          Browse Catalogue
        </Link>
      </div>
    );
  }

  const movie = show.movieId;
  const screen = show.screenId;
  const theatre = screen?.theatreId;

  const handleTimerExpire = () => {
    alert('Your 5-minute seat hold has expired. The seats have been released.');
    navigate(`/shows/${showId}/seats`);
  };

  const handleCancelHold = async () => {
    try {
      await showApi.unlockSeats(showId, selectedSeats);
    } catch (e) {
      console.warn('Unlock failed or already expired');
    }
    navigate(`/shows/${showId}/seats`);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    try {
      setPaymentProcessing(true);
      setErrorMessage('');

      // Call booking confirmation endpoint (simulated mock payment)
      const res = await bookingApi.createBooking({
        showId,
        seats: selectedSeats,
      });

      if (res.success && res.data) {
        navigate(`/bookings/${res.data._id}`, {
          state: { booking: res.data, isNew: true },
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment processing failed. Please try again.';
      setErrorMessage(msg);
      setPaymentProcessing(false);
    }
  };

  const convenienceFee = Math.round(totalAmount * 0.05); // 5% mock tax/fee
  const grandTotal = totalAmount + convenienceFee;

  return (
    <div className="checkout-page py-5">
      <div className="container">
        {/* Navigation & Timer Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <button
            onClick={handleCancelHold}
            className="btn btn-lumina-outline d-inline-flex align-items-center gap-2"
            style={{ width: 'fit-content' }}
          >
            <ChevronLeft size={16} />
            <span>Release Seats & Return</span>
          </button>

          {/* Countdown timer */}
          {lockExpiresAt && (
            <Timer expiresAt={lockExpiresAt} onExpire={handleTimerExpire} />
          )}
        </div>

        {errorMessage && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3"
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="row g-4">
          {/* Order Breakdown Column */}
          <div className="col-lg-7">
            <div className="glass-panel p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <Film size={20} className="text-emerald" />
                  <span>Reservation Overview</span>
                </h5>
                <span
                  className="badge px-3 py-1 rounded-pill"
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: 'var(--emerald-light)',
                    fontSize: '0.75rem',
                  }}
                >
                  Verified Session
                </span>
              </div>

              <div className="d-flex gap-3 mb-4">
                <img
                  src={movie?.posterUrl}
                  alt={movie?.title}
                  className="rounded-3 shadow"
                  style={{
                    width: 85,
                    height: 120,
                    objectFit: 'cover',
                    border: '1px solid var(--border-subtle)',
                  }}
                />
                <div>
                  <h5 className="text-white fw-bold mb-1">{movie?.title}</h5>
                  <p className="text-secondary small mb-2">{movie?.genres?.join(', ')}</p>
                  <p className="text-light small mb-1 d-flex align-items-center gap-1">
                    <MapPin size={14} className="text-emerald" />
                    <span>
                      {theatre?.name} ({screen?.name})
                    </span>
                  </p>
                  <p className="text-secondary small mb-0 d-flex align-items-center gap-2">
                    <span>
                      <Calendar size={13} className="me-1 text-secondary" />
                      {new Date(show.startTime).toLocaleDateString()}
                    </span>
                    <span>
                      <Clock size={13} className="me-1 text-secondary" />
                      {new Date(show.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <hr className="border-secondary opacity-15 my-3" />

              {/* Seats and price breakdown */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center text-secondary small mb-2">
                  <span>Reserved Seats ({selectedSeats.length})</span>
                  <div className="d-flex gap-1 flex-wrap">
                    {selectedSeats.map((s) => (
                      <span
                        key={s}
                        className="badge px-2 py-1 fw-bold"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          borderRadius: 6,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between text-light small mb-2">
                  <span>Base Seat Fare</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="d-flex justify-content-between text-light small mb-2">
                  <span>Cinema Facilities & Service Tax (5%)</span>
                  <span>₹{convenienceFee.toLocaleString()}</span>
                </div>
              </div>

              <hr className="border-secondary opacity-15 my-3" />

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-white fw-bold fs-5">Total Payable</span>
                <span
                  className="fw-bold fs-4"
                  style={{ color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)' }}
                >
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="glass-panel p-3 d-flex align-items-center gap-3">
              <div
                className="p-2 rounded-circle"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--emerald-primary)',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div className="small text-secondary">
                <strong className="text-white d-block">Guaranteed Seat Hold</strong>
                Seats are locked exclusively to your account until the countdown expires.
              </div>
            </div>
          </div>

          {/* Payment Gateway Column */}
          <div className="col-lg-5">
            <div className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <CreditCard size={20} className="text-emerald" />
                  <span>Secure Payment</span>
                </h5>
                <span
                  className="badge px-3 py-1 rounded-pill small"
                  style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: 'var(--ice-cyan)',
                    fontSize: '0.72rem',
                  }}
                >
                  Sandbox Verified
                </span>
              </div>

              <p className="text-secondary small mb-4">
                Mock payment simulator. Click below to confirm reservation and generate your
                digital boarding pass.
              </p>

              <form onSubmit={handleConfirmPayment}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control form-control-cinema"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Card Number</label>
                  <input
                    type="text"
                    className="form-control form-control-cinema"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    required
                  />
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <label className="form-label text-secondary small">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control form-control-cinema"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small">Security CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      className="form-control form-control-cinema"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="btn btn-lumina btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-3"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Authorize Payment (₹{grandTotal.toLocaleString()})</span>
                    </>
                  )}
                </button>

                <p
                  className="text-secondary small text-center mb-0"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Lock size={12} className="me-1 text-emerald" />
                  Protected by 256-bit encryption &bull; Immediate QR e-ticket issuance
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
