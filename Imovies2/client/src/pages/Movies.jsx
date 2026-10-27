import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const queryQ = searchParams.get('q') || '';
  const queryGenre = searchParams.get('genre') || '';
  const queryLanguage = searchParams.get('language') || '';
  const queryStatus = searchParams.get('status') || '';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(queryQ);

  useEffect(() => {
    setSearch(queryQ);
  }, [queryQ]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const params = {
          page: queryPage,
          limit: 12,
        };
        if (queryQ) params.q = queryQ;
        if (queryGenre) params.genre = queryGenre;
        if (queryLanguage) params.language = queryLanguage;
        if (queryStatus) params.status = queryStatus;

        const res = await movieApi.getMovies(params);
        if (res.success) {
          setMovies(res.data);
          setTotal(res.total);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [queryQ, queryGenre, queryLanguage, queryStatus, queryPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('q', search.trim());
  };

  const handleResetFilters = () => {
    setSearch('');
    setSearchParams({});
  };

  const setPage = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const genres = ['Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Thriller', 'Biography', 'Comedy'];
  const languages = ['English', 'Hindi', 'Spanish'];

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-emerald-light fw-bold small text-uppercase mb-1">
            <SlidersHorizontal size={14} />
            <span>Discover Lumina Premieres</span>
          </div>
          <h2 className="text-white fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            Movie Catalogue
          </h2>
          <p className="text-secondary small mb-0 mt-1">
            Browse through active multiplex releases and advance bookings.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-secondary small">
            Showing <strong className="text-white">{movies.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> titles
          </span>
          {(queryQ || queryGenre || queryLanguage || queryStatus) && (
            <button
              onClick={handleResetFilters}
              className="btn btn-lumina-outline btn-sm py-1 px-3"
            >
              <RefreshCw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Search box */}
          <div className="col-lg-4 col-md-6">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <Search
                size={16}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
              />
              <input
                type="text"
                className="form-control form-control-cinema ps-5 py-2"
                placeholder="Search by title, cast..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          {/* Status selector */}
          <div className="col-lg-3 col-md-6 col-sm-4">
            <select
              className="form-select form-select-cinema py-2"
              value={queryStatus}
              onChange={(e) => updateParam('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="now_showing">Now Showing</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>

          {/* Genre selector */}
          <div className="col-lg-3 col-md-6 col-sm-4">
            <select
              className="form-select form-select-cinema py-2"
              value={queryGenre}
              onChange={(e) => updateParam('genre', e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language selector */}
          <div className="col-lg-2 col-md-6 col-sm-4">
            <select
              className="form-select form-select-cinema py-2"
              value={queryLanguage}
              onChange={(e) => updateParam('language', e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="text-center py-5 my-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: 'var(--emerald-primary)' }}
          />
          <p className="text-secondary small mt-2">Loading catalogue titles...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="glass-panel p-5 text-center text-secondary my-4">
          <h5>No matches found</h5>
          <p className="small mb-3">Try adjusting your search queries or genre filters.</p>
          <button onClick={handleResetFilters} className="btn btn-lumina btn-sm">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
          {movies.map((movie) => (
            <div key={movie._id} className="col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button
            className="btn btn-lumina-outline btn-sm px-3"
            disabled={queryPage <= 1}
            onClick={() => setPage(queryPage - 1)}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`btn btn-sm px-3 ${
                  queryPage === pageNum ? 'btn-lumina fw-bold' : 'btn-lumina-outline'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="btn btn-lumina-outline btn-sm px-3"
            disabled={queryPage >= totalPages}
            onClick={() => setPage(queryPage + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;
