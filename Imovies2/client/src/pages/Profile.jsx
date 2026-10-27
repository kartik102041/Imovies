import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password && password.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const payload = { name };
      if (password) payload.password = password;

      const res = await authApi.updateProfile(payload);
      if (res.success && res.data) {
        updateUser(res.data);
        setSuccess('Account profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page py-5">
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="glass-panel p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="d-flex align-items-center justify-content-center p-3 rounded-4 shadow"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--emerald-primary)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
              }}
            >
              <User size={30} />
            </div>
            <div>
              <h3 className="text-white fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
                {user?.name}
              </h3>
              <div className="d-flex align-items-center gap-2 text-secondary small">
                <span>{user?.email}</span>
                <span
                  className="badge px-2 py-1 text-uppercase"
                  style={{
                    background:
                      user?.role === 'admin'
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(16, 185, 129, 0.15)',
                    color:
                      user?.role === 'admin'
                        ? 'var(--amber-gold)'
                        : 'var(--emerald-light)',
                    border: `1px solid ${
                      user?.role === 'admin'
                        ? 'rgba(245, 158, 11, 0.3)'
                        : 'rgba(16, 185, 129, 0.3)'
                    }`,
                    fontSize: '0.68rem',
                  }}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 mb-3 small rounded-3">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 small rounded-3">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label text-secondary small">Full Name</label>
              <input
                type="text"
                className="form-control form-control-cinema"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Account Email (Verified)</label>
              <input
                type="email"
                className="form-control form-control-cinema text-muted"
                value={user?.email || ''}
                disabled
              />
            </div>

            <hr className="border-secondary opacity-15 my-4" />

            <h6 className="text-white fw-bold mb-3 small text-uppercase">
              Update Security Credentials
            </h6>

            <div className="mb-3">
              <label className="form-label text-secondary small">
                New Password (leave empty to keep current)
              </label>
              <input
                type="password"
                className="form-control form-control-cinema"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small">Confirm New Password</label>
              <input
                type="password"
                className="form-control form-control-cinema"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lumina w-100 py-3 d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                  <span>Updating Profile...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
