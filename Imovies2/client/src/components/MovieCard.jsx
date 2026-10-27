import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Globe, Ticket, ChevronRight } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const isComingSoon = movie.status === 'coming_soon';

  // Smart format tag based on title or default
  const formatTag = movie.durationMin > 150 ? 'IMAX Laser' : 'Dolby 4K';

  return (
    <div className="movie-card h-100 d-flex flex-column">
      <Link to={`/movies/${movie._id}`} className="text-decoration-none">
        <div className="movie-poster-container">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
            }}
          />

          {/* Format Badge */}
          <div className="format-badge">
            {formatTag}
          </div>

          {/* Rating Badge */}
          {movie.rating > 0 && (
            <div className="rating-badge">
              <Star size={13} fill="var(--amber-gold)" color="var(--amber-gold)" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Coming Soon Pill */}
          {isComingSoon && (
            <div
              className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded small fw-bold"
              style={{
                background: 'rgba(245, 158, 11, 0.9)',
                color: '#080c14',
                fontSize: '0.72rem',
                letterSpacing: '0.5px',
              }}
            >
              PREMIERE SOON
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <Link to={`/movies/${movie._id}`} className="text-decoration-none">
            <h5
              className="card-title text-white mb-2 text-truncate"
              title={movie.title}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 700,
              }}
            >
              {movie.title}
            </h5>
          </Link>

          {/* Meta details */}
          <div className="d-flex align-items-center gap-3 text-secondary small mb-2">
            <span className="d-flex align-items-center gap-1">
              <Clock size={13} className="text-emerald" /> {movie.durationMin}m
            </span>
            <span className="d-flex align-items-center gap-1">
              <Globe size={13} className="text-secondary" /> {movie.language}
            </span>
          </div>

          {/* Genres */}
          <div className="d-flex flex-wrap gap-1 mb-3">
            {movie.genres?.slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className="badge fw-normal"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.7rem',
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div>
          <Link
            to={`/movies/${movie._id}`}
            className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${
              isComingSoon ? 'btn-lumina-outline' : 'btn-lumina'
            }`}
            style={{ fontSize: '0.88rem' }}
          >
            {isComingSoon ? (
              <>
                <span>View Details</span>
                <ChevronRight size={15} />
              </>
            ) : (
              <>
                <Ticket size={15} />
                <span>Reserve Seats</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
