import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import {
  Search,
  Calendar,
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Zap,
  Award,
  Layers,
} from 'lucide-react';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const navigate = useNavigate();

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Thriller'];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [showingRes, comingRes] = await Promise.all([
          movieApi.getMovies({ status: 'now_showing', limit: 8 }),
          movieApi.getMovies({ status: 'coming_soon', limit: 4 }),
        ]);

        if (showingRes.success) setNowShowing(showingRes.data);
        if (comingRes.success) setComingSoon(comingRes.data);
      } catch (err) {
        console.error('Error fetching home movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredShowing =
    selectedGenre === 'All'
      ? nowShowing
      : nowShowing.filter((m) => m.genres?.includes(selectedGenre));

  // Spotlight movie for hero banner
  const spotlightMovie = nowShowing[0] || null;

  return (
    <div className="home-page pb-5">
      {/* Hero Premiere Banner */}
      {spotlightMovie && (
        <section
          className="hero-banner position-relative overflow-hidden mb-5"
          style={{
            minHeight: '75vh',
            backgroundImage: `linear-gradient(to right, #080c14 20%, rgba(8, 12, 20, 0.85) 60%, rgba(8, 12, 20, 0.4) 100%), url(${spotlightMovie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div className="container py-5 my-auto position-relative" style={{ zIndex: 2 }}>
            <div className="row">
              <div className="col-lg-7 col-md-9">
                {/* Spotlight Chip */}
                <div
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 fw-bold small"
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: 'var(--emerald-light)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  <Sparkles size={14} />
                  <span>LUMINA SPOTLIGHT PREMIERE</span>
                </div>

                <h1
                  className="display-4 fw-black text-white mb-3"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    lineHeight: 1.12,
                    letterSpacing: '-1px',
                  }}
                >
                  {spotlightMovie.title}
                </h1>

                <p
                  className="lead text-light opacity-75 mb-4"
                  style={{ fontSize: '1.05rem', maxWidth: 620, lineHeight: 1.6 }}
                >
                  {spotlightMovie.description}
                </p>

                {/* Metadata tags */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                  <span
                    className="badge d-flex align-items-center gap-1 px-3 py-2 fw-bold"
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: 'var(--amber-gold)',
                      borderRadius: 10,
                    }}
                  >
                    ★ {spotlightMovie.rating.toFixed(1)} / 10
                  </span>
                  <span
                    className="badge px-3 py-2 fw-semibold"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      borderRadius: 10,
                    }}
                  >
                    {spotlightMovie.durationMin} mins
                  </span>
                  <span
                    className="badge px-3 py-2 fw-semibold"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      borderRadius: 10,
                    }}
                  >
                    {spotlightMovie.language}
                  </span>
                  <span
                    className="badge px-3 py-2 fw-semibold"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: 'var(--emerald-light)',
                      borderRadius: 10,
                    }}
                  >
                    IMAX Laser 3D
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <Link
                    to={`/movies/${spotlightMovie._id}`}
                    className="btn btn-lumina btn-lg px-4 py-3"
                  >
                    <Ticket size={18} />
                    <span>Reserve Seats Now</span>
                  </Link>

                  {spotlightMovie.trailerUrl && (
                    <a
                      href={spotlightMovie.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-lumina-outline btn-lg px-4 py-3"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>Watch Trailer</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modern Filter & Search Bar */}
      <div className="container mb-5">
        <div className="glass-panel p-3 p-md-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-lg-5">
              <form onSubmit={handleSearchSubmit} className="position-relative">
                <Search
                  size={18}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                />
                <input
                  type="text"
                  className="form-control form-control-cinema ps-5"
                  placeholder="Search titles, directors, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Quick Genre Chips */}
            <div className="col-lg-7">
              <div className="d-flex gap-2 overflow-x-auto pb-1 align-items-center">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setSelectedGenre(genre)}
                    className={`filter-chip ${selectedGenre === genre ? 'active' : ''}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Now Showing Section */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 text-emerald-light fw-bold small text-uppercase mb-1">
              <Sparkles size={14} />
              <span>Currently in Theatres</span>
            </div>
            <h2 className="text-white fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
              Now Showing
            </h2>
          </div>
          <Link
            to="/movies?status=now_showing"
            className="text-secondary text-decoration-none d-flex align-items-center gap-1 hover-white"
          >
            <span>View Full Lineup</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              role="status"
              style={{ color: 'var(--emerald-primary)' }}
            />
          </div>
        ) : filteredShowing.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            No active movies found for the selected category.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredShowing.map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      {comingSoon.length > 0 && (
        <section className="container mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div
                className="d-flex align-items-center gap-2 fw-bold small text-uppercase mb-1"
                style={{ color: 'var(--amber-gold)' }}
              >
                <Calendar size={14} />
                <span>Upcoming Releases</span>
              </div>
              <h2 className="text-white fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
                Coming Soon
              </h2>
            </div>
            <Link
              to="/movies?status=coming_soon"
              className="text-secondary text-decoration-none d-flex align-items-center gap-1 hover-white"
            >
              <span>Explore All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {comingSoon.map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* The Lumina Experience Standard */}
      <section className="container">
        <div className="glass-panel p-4 p-md-5">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div
                className="d-inline-flex p-3 rounded-4 mb-3"
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--emerald-primary)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <Zap size={26} />
              </div>
              <h5 className="text-white fw-bold mb-2">Atomic Seat Hold</h5>
              <p className="text-secondary small mb-0" style={{ lineHeight: 1.6 }}>
                Real-time atomic locking guarantees your chosen seats for 5 minutes during
                checkout with zero double-booking risk.
              </p>
            </div>

            <div className="col-md-4">
              <div
                className="d-inline-flex p-3 rounded-4 mb-3"
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: 'var(--ice-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                }}
              >
                <Sparkles size={26} />
              </div>
              <h5 className="text-white fw-bold mb-2">Digital QR Passes</h5>
              <p className="text-secondary small mb-0" style={{ lineHeight: 1.6 }}>
                Contactless digital boarding passes with instant high-resolution QR codes and
                turnstile-ready entry vouchers.
              </p>
            </div>

            <div className="col-md-4">
              <div
                className="d-inline-flex p-3 rounded-4 mb-3"
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--amber-gold)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h5 className="text-white fw-bold mb-2">Smart Cancellation</h5>
              <p className="text-secondary small mb-0" style={{ lineHeight: 1.6 }}>
                Flexible automated cancellation up to 2 hours prior to showtime with instant seat
                release and simulated refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
