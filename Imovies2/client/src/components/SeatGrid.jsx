import React from 'react';
import { Armchair, Sparkles, Crown, Ticket } from 'lucide-react';

const SeatGrid = ({
  seats = [],
  prices = { regular: 150, premium: 250, recliner: 400 },
  selectedSeats = [],
  onSeatToggle,
  currentUserId,
}) => {
  // Group seats by row letter (e.g. 'A', 'B', 'C')
  const groupedRows = seats.reduce((acc, seat) => {
    const rowLetter = seat.seatId.match(/[A-Z]+/)?.[0] || 'A';
    if (!acc[rowLetter]) {
      acc[rowLetter] = {
        label: rowLetter,
        category: seat.category,
        seats: [],
      };
    }
    acc[rowLetter].seats.push(seat);
    return acc;
  }, {});

  const rows = Object.values(groupedRows);

  const getSeatStatus = (seat) => {
    if (selectedSeats.includes(seat.seatId)) {
      return 'selected';
    }
    if (seat.status === 'booked') {
      return 'booked';
    }
    if (seat.status === 'locked') {
      return 'locked';
    }
    return 'available';
  };

  const handleSeatClick = (seat) => {
    const status = getSeatStatus(seat);
    if (status === 'booked' || status === 'locked') {
      return;
    }
    onSeatToggle(seat);
  };

  const getCategoryDetails = (category) => {
    switch (category?.toLowerCase()) {
      case 'recliner':
        return {
          title: 'Lumina Recliner Lounge',
          badgeColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: 'rgba(245, 158, 11, 0.35)',
          textColor: 'var(--amber-gold)',
          icon: <Crown size={12} />,
        };
      case 'premium':
        return {
          title: 'Prime Club',
          badgeColor: 'rgba(56, 189, 248, 0.12)',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          textColor: 'var(--ice-cyan)',
          icon: <Sparkles size={12} />,
        };
      default:
        return {
          title: 'Classic Gallery',
          badgeColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          textColor: 'var(--emerald-light)',
          icon: <Ticket size={12} />,
        };
    }
  };

  return (
    <div className="seat-grid-container text-center py-4">
      {/* Curved Minimalist Cinema Screen */}
      <div className="cinema-screen-container">
        <div className="cinema-screen"></div>
        <div className="cinema-screen-glow"></div>
        <div className="d-flex align-items-center justify-content-center gap-2 mt-2 mb-4">
          <span
            className="text-uppercase small fw-bold"
            style={{
              letterSpacing: '3px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            All Eyes Toward Projection &bull; Screen
          </span>
        </div>
      </div>

      {/* Seat Rows by Category */}
      <div className="d-flex flex-column gap-3 align-items-center mb-5">
        {rows.map((row) => {
          const catInfo = getCategoryDetails(row.category);
          const isRecliner = row.category === 'recliner';

          return (
            <div key={row.label} className="w-100 d-flex flex-column align-items-center">
              {/* Category tag */}
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  className="badge d-inline-flex align-items-center gap-1 px-3 py-1 fw-semibold"
                  style={{
                    background: catInfo.badgeColor,
                    border: `1px solid ${catInfo.borderColor}`,
                    color: catInfo.textColor,
                    fontSize: '0.72rem',
                    borderRadius: 20,
                  }}
                >
                  {catInfo.icon}
                  <span>{catInfo.title}</span>
                  <span className="opacity-75 ms-1">₹{prices[row.category] || 150}</span>
                </span>
              </div>

              <div
                className={`d-flex align-items-center justify-content-center gap-1 ${
                  isRecliner ? 'gap-sm-3' : 'gap-sm-2'
                } flex-wrap`}
              >
                {/* Row Label Left */}
                <div
                  className="fw-bold me-2 user-select-none"
                  style={{
                    width: 22,
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {row.label}
                </div>

                {/* Seats in Row */}
                {row.seats.map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <div
                      key={seat.seatId}
                      className={`seat-box ${status}`}
                      onClick={() => handleSeatClick(seat)}
                      title={`Seat ${seat.seatId} (${row.category}) - ₹${
                        prices[seat.category] || 150
                      }`}
                      style={
                        isRecliner
                          ? {
                              width: 38,
                              height: 34,
                              borderRadius: '10px 10px 5px 5px',
                            }
                          : {}
                      }
                    >
                      {seat.seatId.replace(/^[A-Z]+/, '')}
                    </div>
                  );
                })}

                {/* Row Label Right */}
                <div
                  className="fw-bold ms-2 user-select-none"
                  style={{
                    width: 22,
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {row.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Seat Legend */}
      <div className="glass-panel p-3 d-inline-flex flex-wrap justify-content-center gap-4 align-items-center mx-auto">
        <div className="seat-legend-item">
          <div
            className="seat-box available"
            style={{ width: 22, height: 22, fontSize: '0.65rem' }}
          ></div>
          <span>Available</span>
        </div>
        <div className="seat-legend-item">
          <div
            className="seat-box selected"
            style={{ width: 22, height: 22, fontSize: '0.65rem' }}
          ></div>
          <span>Selected</span>
        </div>
        <div className="seat-legend-item">
          <div
            className="seat-box locked"
            style={{ width: 22, height: 22, fontSize: '0.65rem' }}
          ></div>
          <span>In Hold</span>
        </div>
        <div className="seat-legend-item">
          <div
            className="seat-box booked"
            style={{ width: 22, height: 22, fontSize: '0.65rem' }}
          ></div>
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
