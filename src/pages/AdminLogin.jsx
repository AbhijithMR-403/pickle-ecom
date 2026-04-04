import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, User, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { loginAdmin, clearAuthError } from '../store/slices/authSlice';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((s) => s.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to admin
  useEffect(() => {
    if (token) navigate('/admin', { replace: true });
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ username, password }));
  };

  return (
    <div className="admin-login-root">
      {/* Decorative background */}
      <div className="admin-login-bg-glow" />

      <div className="admin-login-card">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-serif">Pickle Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertTriangle size={16} className="shrink-0" />
            <span>Invalid username or password</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="admin-field">
            <span>Username</span>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                required
                type="text"
                name="username"
                autoComplete="username"
                className="admin-input pl-10"
                placeholder="Enter username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); dispatch(clearAuthError()); }}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="admin-field">
            <span>Password</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                className="admin-input pl-10 pr-10"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); dispatch(clearAuthError()); }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary w-full justify-center py-3 text-sm"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Signing in…</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Ammachi's Kitchen &copy; 2026
        </div>
      </div>
    </div>
  );
}
