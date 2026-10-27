import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Printer,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Tv,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
} from 'lucide-react';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    // Fire celebratory confetti if freshly booked
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669', '#38bdf8', '#fbbf24'],
      });
    } catch (e) {
      // Confetti fallback
    }

    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await bookingApi.getBookingById(id);
          if (res.success) {
            setBooking(res.data);
          }
        } catch (err) {
          console.error('Failed to load booking details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div
          className="spinner-border"
          role="status"
          style={{ color: 'var(--emerald-primary)' }}
        />
        <p className="text-secondary small mt-2">Issuing digital boarding pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5>Admission Pass Not Found</h5>
        <Link to="/my-bookings" className="btn btn-lumina mt-3">
          View My Passes
        </Link>
      </div>
    );
  }

  const show = booking.showId;
  const movie = show?.movieId;
  const screen = show?.screenId;
  const theatre = screen?.theatreId;

  const formattedDate = show?.startTime
    ? new Date(show.startTime).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const formattedTime = show?.startTime
    ? new Date(show.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="booking-confirmation-page py-5">
      <div className="container" style={{ maxWidth: 780 }}>
        {/* Success Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3 shadow"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--emerald-primary)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
            }}
          >
            <CheckCircle size={40} />
          </div>
          <h2 className="text-white fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
            Reservation Confirmed!
          </h2>
          <p className="text-secondary small">
            Your seats are locked and your Lumina Digital Boarding Pass is ready.
          </p>
        </div>

        {/* E-Ticket Card */}
        <div className="ticket-card p-4 p-md-5 mb-4 text-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <Ticket size={24} className="text-emerald" />
              <span
                className="fw-bold tracking-wider fs-5"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                LUMINA ADMISSION PASS
              </span>
            </div>
            <span
              className="badge px-3 py-2 fw-bold text-uppercase"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--emerald-light)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 8,
              }}
            >
              {booking.status}
            </span>
          </div>

          <div className="row g-4 align-items-center">
            {/* Movie Info */}
            <div className="col-md-8">
              <h3 className="fw-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {movie?.title}
              </h3>
              <p className="text-secondary small mb-3">
                {movie?.language} &bull; {movie?.genres?.join(', ')} &bull; {movie?.durationMin} mins
              </p>

              <div className="mb-3">
                <div
                  className="d-flex align-items-center gap-2 fw-semibold mb-1"
                  style={{ color: 'var(--amber-gold)' }}
                >
                  <MapPin size={16} />
                  <span>{theatre?.name}</span>
                </div>
                <div className="text-secondary small ps-4">
                  {theatre?.address}, {theatre?.city}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 text-light small mb-3">
                <div>
                  <span className="text-secondary d-block small" style={{ fontSize: '0.72rem' }}>
                    AUDITORIUM SCREEN
                  </span>
                  <strong>{screen?.name}</strong>
                </div>
                <div>
                  <span className="text-secondary d-block small" style={{ fontSize: '0.72rem' }}>
                    SCREENING DATE
                  </span>
                  <strong>{formattedDate}</strong>
                </div>
                <div>
                  <span className="text-secondary d-block small" style={{ fontSize: '0.72rem' }}>
                    SHOWTIME
                  </span>
                  <strong>{formattedTime}</strong>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 pt-3 border-top border-secondary border-opacity-20">
                <div>
                  <span className="text-secondary d-block small" style={{ fontSize: '0.72rem' }}>
                    RESERVED SEATS
                  </span>
                  <div className="d-flex gap-1 mt-1 flex-wrap">
                    {booking.seats?.map((seat) => (
                      <span
                        key={seat}
                        className="badge px-2 py-1"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          borderRadius: 6,
                          fontSize: '0.85rem',
                        }}
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-secondary d-block small" style={{ fontSize: '0.72rem' }}>
                    TOTAL FARE PAID
                  </span>
                  <span
                    className="fw-bold fs-5"
                    style={{ color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)' }}
                  >
                    ₹{booking.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Column */}
            <div className="col-md-4 text-center border-start-md border-secondary border-opacity-20 ps-md-4">
              <div
                className="bg-white p-3 rounded-4 d-inline-block shadow-sm mb-2"
                style={{ width: 'fit-content' }}
              >
                <QRCodeSVG
                  value={`LUMINA:${booking.reference}:${booking._id}`}
                  size={140}
                  level="H"
                />
              </div>
              <div className="small text-secondary mt-1">
                Boarding Reference:
                <strong
                  className="d-block text-white fw-bold tracking-wider fs-6 mt-1"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {booking.reference}
                </strong>
              </div>
              <div className="text-secondary mt-1" style={{ fontSize: '0.72rem' }}>
                Present at turnstile optical scanner
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <button
            onClick={handlePrint}
            className="btn btn-lumina-outline d-flex align-items-center gap-2"
          >
            <Printer size={16} />
            <span>Print / Save Boarding Pass</span>
          </button>

          <div className="d-flex gap-2">
            <Link to="/my-bookings" className="btn btn-lumina-outline">
              My Digital Passes
            </Link>
            <Link to="/" className="btn btn-lumina d-flex align-items-center gap-2">
              <span>Return to Lineup</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
