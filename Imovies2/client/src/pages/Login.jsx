import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LuminaLogo from '../components/LuminaLogo';
import { Lock, Mail, AlertCircle, Shield, User, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    login(demoEmail, demoPassword)
      .then(() => navigate(redirectPath, { replace: true }))
      .catch((err) => setError(err.response?.data?.message || 'Quick login failed'));
  };

  return (
    <div className="login-page py-5 my-auto">
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="glass-panel p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center mb-3">
              <LuminaLogo size="lg" showTagline={true} />
            </div>
            <h3 className="text-white fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
              Welcome Back
            </h3>
            <p className="text-secondary small">
              Sign in to reserve seats and access your digital passes.
            </p>
          </div>

          {error && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 mb-3 small rounded-3"
              role="alert"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary small">Email Address</label>
              <div className="position-relative">
                <Mail
                  size={16}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                />
                <input
                  type="email"
                  className="form-control form-control-cinema ps-5"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small">Password</label>
              <div className="position-relative">
                <Lock
                  size={16}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                />
                <input
                  type="password"
                  className="form-control form-control-cinema ps-5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lumina w-100 py-3 mb-4"
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                'Sign In to Lumina'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="p-3 rounded-4 bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-4">
            <span
              className="text-secondary small fw-bold d-block text-uppercase mb-2"
              style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
            >
              Instant Demo Access
            </span>
            <div className="d-grid gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user@imovies.com', 'User@12345')}
                className="btn btn-lumina-outline btn-sm d-flex align-items-center justify-content-center gap-2"
              >
                <User size={14} className="text-emerald" />
                <span>Login as Customer Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@imovies.com', 'Admin@12345')}
                className="btn btn-lumina-outline btn-sm d-flex align-items-center justify-content-center gap-2"
              >
                <Shield size={14} style={{ color: 'var(--amber-gold)' }} />
                <span>Login as Cinema Operator (Admin)</span>
              </button>
            </div>
          </div>

          <div className="text-center text-secondary small">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="fw-bold text-decoration-none"
              style={{ color: 'var(--emerald-light)' }}
            >
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
