import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import {
  Star,
  Clock,
  Globe,
  Calendar,
  MapPin,
  Play,
  Ticket,
  ChevronRight,
  Info,
  Tv,
  Sparkles,
} from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedCity, setSelectedCity] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Generate next 5 dates for the date selector
  const availableDates = Array.from({ length: 5 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return {
      iso: d.toISOString().split('T')[0],
      dayName:
        idx === 0
          ? 'Today'
          : idx === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        setLoading(true);
        const [movieRes, showsRes] = await Promise.all([
          movieApi.getMovieById(id),
          movieApi.getMovieShows(id, { date: selectedDate, city: selectedCity }),
        ]);

        if (movieRes.success) setMovie(movieRes.data);
        if (showsRes.success) setShows(showsRes.data);
      } catch (err) {
        console.error('Failed to fetch movie details or shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id, selectedDate, selectedCity]);

  // Group shows by Theatre -> Screen
  const groupedTheatres = shows.reduce((acc, show) => {
    const screen = show.screenId;
    const theatre = screen?.theatreId;
    if (!theatre) return acc;

    const theatreId = theatre._id;
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre,
        screens: {},
      };
    }

    const screenId = screen._id;
    if (!acc[theatreId].screens[screenId]) {
      acc[theatreId].screens[screenId] = {
        screen,
        shows: [],
      };
    }

    acc[theatreId].screens[screenId].shows.push(show);
    return acc;
  }, {});

  const theatresList = Object.values(groupedTheatres);

  if (loading && !movie) {
    return (
      <div className="text-center py-5 my-5">
        <div
          className="spinner-border"
          role="status"
          style={{ color: 'var(--emerald-primary)' }}
        />
        <p className="text-secondary small mt-2">Loading feature presentation...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h3>Feature Not Found</h3>
        <Link to="/movies" className="btn btn-lumina mt-3">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page pb-5">
      {/* Backdrop Header */}
      <div
        className="position-relative py-5 mb-5"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(8, 12, 20, 0.75), var(--bg-deep) 98%), url(${movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container position-relative pt-4" style={{ zIndex: 2 }}>
          <div className="row g-4 align-items-center">
            {/* Poster Column */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <div
                className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25 mx-auto"
                style={{
                  maxWidth: 280,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                }}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-100 d-block"
                  style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Movie Info Column */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span
                  className="badge px-3 py-1 rounded-pill small fw-bold"
                  style={{
                    background:
                      movie.status === 'now_showing'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                    color:
                      movie.status === 'now_showing'
                        ? 'var(--emerald-light)'
                        : 'var(--amber-gold)',
                    border: `1px solid ${
                      movie.status === 'now_showing'
                        ? 'rgba(16, 185, 129, 0.35)'
                        : 'rgba(245, 158, 11, 0.35)'
                    }`,
                  }}
                >
                  {movie.status === 'now_showing' ? 'NOW SCREENING' : 'UPCOMING ADVANCE BOOKING'}
                </span>
                {movie.genres?.map((g) => (
                  <span
                    key={g}
                    className="badge rounded-pill fw-normal"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h1
                className="display-5 fw-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}
              >
                {movie.title}
              </h1>

              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary mb-3 small">
                {movie.rating > 0 && (
                  <div
                    className="d-flex align-items-center gap-1 fw-bold"
                    style={{ color: 'var(--amber-gold)' }}
                  >
                    <Star size={16} fill="var(--amber-gold)" color="var(--amber-gold)" />
                    <span>{movie.rating.toFixed(1)} / 10 Score</span>
                  </div>
                )}
                <span>&bull;</span>
                <span className="d-flex align-items-center gap-1 text-light">
                  <Clock size={15} className="text-emerald" /> {movie.durationMin} Minutes
                </span>
                <span>&bull;</span>
                <span className="d-flex align-items-center gap-1 text-light">
                  <Globe size={15} className="text-secondary" /> {movie.language}
                </span>
                <span>&bull;</span>
                <span className="text-light">
                  Released{' '}
                  {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <p
                className="text-light opacity-80 mb-4"
                style={{ maxWidth: 720, lineHeight: 1.6, fontSize: '0.96rem' }}
              >
                {movie.description}
              </p>

              {movie.cast && movie.cast.length > 0 && (
                <div className="mb-4">
                  <span
                    className="text-secondary small fw-bold text-uppercase d-block mb-2"
                    style={{ letterSpacing: '0.5px' }}
                  >
                    Lead Ensemble
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    {movie.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="badge py-1 px-3 fw-normal"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          borderRadius: 8,
                          fontSize: '0.8rem',
                        }}
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.trailerUrl && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="btn btn-lumina-outline d-inline-flex align-items-center gap-2"
                >
                  <Play size={16} fill="#ffffff" />
                  <span>Watch Official Preview</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal (if open) */}
      {trailerOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(4, 6, 12, 0.92)', zIndex: 1050 }}
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="glass-panel p-3 w-100"
            style={{ maxWidth: 840 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white m-0 small fw-bold">
                {movie.title} &mdash; Official Trailer
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setTrailerOpen(false)}
              ></button>
            </div>
            <div className="ratio ratio-16x9 rounded overflow-hidden">
              <iframe
                src={
                  movie.trailerUrl.includes('watch?v=')
                    ? movie.trailerUrl.replace('watch?v=', 'embed/')
                    : movie.trailerUrl
                }
                title="Trailer"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Showtimes & Booking Section */}
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 text-emerald-light fw-bold small text-uppercase mb-1">
              <Sparkles size={14} />
              <span>Auditoriums & Showtimes</span>
            </div>
            <h3 className="text-white fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
              Select Show & Screening Format
            </h3>
            <p className="text-secondary small m-0 mt-1">
              Pick your preferred multiplex venue, cinema hall, and time slot.
            </p>
          </div>

          {/* City Filter */}
          <div className="d-flex align-items-center gap-2">
            <MapPin size={18} className="text-emerald" />
            <select
              className="form-select form-select-cinema"
              style={{ width: 190 }}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Regions</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4">
          {availableDates.map((item) => (
            <button
              key={item.iso}
              onClick={() => setSelectedDate(item.iso)}
              className={`date-pill ${selectedDate === item.iso ? 'active' : ''}`}
            >
              <div className="small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
                {item.dayName}
              </div>
              <div className="fs-5 fw-bold text-white my-1">{item.dateNum}</div>
              <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>
                {item.month}
              </div>
            </button>
          ))}
        </div>

        {/* Grouped Showtimes List */}
        {theatresList.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            <Info size={40} className="mb-2" style={{ color: 'var(--amber-gold)' }} />
            <h5>No scheduled screenings found for this date & region.</h5>
            <p className="small mb-0">Try picking another date or check other nearby cities.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {theatresList.map(({ theatre, screens }) => (
              <div key={theatre._id} className="glass-panel p-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                  <div>
                    <h5 className="text-white fw-bold mb-1">{theatre.name}</h5>
                    <p className="text-secondary small mb-0 d-flex align-items-center gap-1">
                      <MapPin size={13} style={{ color: 'var(--amber-gold)' }} />
                      {theatre.address}, {theatre.city}
                    </p>
                  </div>
                  <span
                    className="badge d-inline-flex align-items-center gap-1 px-3 py-1"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      color: 'var(--emerald-light)',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span>Lumina Certified Sound & Vision</span>
                  </span>
                </div>

                <hr className="border-secondary opacity-15 my-3" />

                {/* Screens in this Theatre */}
                <div className="d-flex flex-column gap-3">
                  {Object.values(screens).map(({ screen, shows }) => (
                    <div key={screen._id} className="row g-2 align-items-center">
                      <div className="col-md-3">
                        <span className="text-light fw-semibold d-flex align-items-center gap-2">
                          <Tv size={16} className="text-emerald" />
                          <span>{screen.name}</span>
                        </span>
                      </div>

                      <div className="col-md-9">
                        <div className="d-flex flex-wrap gap-2">
                          {shows.map((show) => {
                            const timeStr = new Date(show.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                            const minPrice = Math.min(
                              show.prices?.regular || 150,
                              show.prices?.premium || 250,
                              show.prices?.recliner || 400
                            );

                            return (
                              <Link
                                key={show._id}
                                to={`/shows/${show._id}/seats`}
                                className="showtime-chip text-decoration-none d-flex flex-column align-items-center"
                              >
                                <span className="text-white fw-bold">{timeStr}</span>
                                <span
                                  className="small mt-1"
                                  style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--emerald-light)',
                                    fontWeight: 600,
                                  }}
                                >
                                  from ₹{minPrice}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
