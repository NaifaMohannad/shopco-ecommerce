import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import useWindowSize from '../hooks/useWindowSize';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);
    const { width } = useWindowSize();
    const isMobile = width < 768;

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f2f0f1',
            padding: isMobile ? '16px' : '40px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                padding: isMobile ? '24px 20px' : '48px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
            }}>
                {/* Logo */}
                <h1 style={{
                    fontSize: isMobile ? '24px' : '28px',
                    fontWeight: '900',
                    textAlign: 'center',
                    marginBottom: '8px',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '2px',
                }}>
                    SHOP.CO
                </h1>
                <h2 style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: '8px'
                }}>
                    Welcome Back
                </h2>
                <p style={{
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: '24px',
                    fontSize: '14px'
                }}>
                    Sign in to your account
                </p>

                {/* Error Message */}
                {error && (
                    <div style={{
                        backgroundColor: '#ffe5e5',
                        color: '#ff3333',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        ❌ {error?.error || 'Login failed! Please try again.'}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '8px' }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Forgot Password */}
                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <Link to="/" style={{
                            color: '#000',
                            fontSize: '13px',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '16px',
                            opacity: loading ? 0.7 : 1
                        }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px'
                    }}>
                        <hr style={{ flex: 1, borderColor: '#e5e5e5' }} />
                        <span style={{ color: '#666', fontSize: '14px' }}>or</span>
                        <hr style={{ flex: 1, borderColor: '#e5e5e5' }} />
                    </div>

                    {/* Google Button */}
                    <button
                        type="button"
                        style={{
                            width: '100%',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: '1px solid #e5e5e5',
                            borderRadius: '50px',
                            padding: '14px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                        🌐 Continue with Google
                    </button>

                    {/* Register Link */}
                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{
                            color: '#000',
                            fontWeight: '700',
                            textDecoration: 'none'
                        }}>
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px'
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
};

export default LoginPage;