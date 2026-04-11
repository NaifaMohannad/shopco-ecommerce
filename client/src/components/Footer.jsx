import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useWindowSize from '../hooks/useWindowSize';

function Footer() {
    const [email, setEmail] = useState('');
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <footer>
            {/* Newsletter Section */}
            <div style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: isMobile ? '32px 20px' : '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '20px',
                margin: isMobile ? '20px 16px' : '40px',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '24px',
            }}>
                <h2 style={{
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    maxWidth: isMobile ? '100%' : '400px',
                    lineHeight: '1.2',
                    textAlign: isMobile ? 'center' : 'left',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '1px',
                }}>
                    Stay Up To Date About Our Latest Offers
                </h2>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: isMobile ? '100%' : 'auto'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderRadius: '50px',
                        padding: '12px 20px',
                        gap: '8px',
                        width: isMobile ? '100%' : '300px',
                        boxSizing: 'border-box',
                    }}>
                        <span>✉️</span>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                fontSize: '14px',
                                width: '100%',
                                color: '#000'
                            }}
                        />
                    </div>
                    <button style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: isMobile ? '100%' : '300px',
                        boxSizing: 'border-box',
                    }}>
                        Subscribe to Newsletter
                    </button>
                </div>
            </div>

            {/* Footer Links */}
            <div style={{
                padding: isMobile ? '32px 16px' : '40px',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr 1fr',
                gap: isMobile ? '24px' : '40px',
                borderTop: '1px solid #e5e5e5'
            }}>
                {/* Brand - full width on mobile */}
                <div style={{
                    gridColumn: isMobile ? '1 / -1' : 'auto'
                }}>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        marginBottom: '16px',
                        fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: '1px',
                    }}>
                        SHOP.CO
                    </h3>
                    <p style={{
                        color: '#666',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        maxWidth: '200px'
                    }}>
                        We have clothes that suits your style and which you're proud to wear. From women to men.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        {['𝕏', 'f', '📷', '⭕'].map((icon, i) => (
                            <button key={i} style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid #e5e5e5',
                                background: '#fff',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}>{icon}</button>
                        ))}
                    </div>
                </div>

                {/* Company */}
                <div>
                    <h4 style={{
                        fontWeight: '700',
                        marginBottom: '16px',
                        letterSpacing: '1px',
                        fontSize: isMobile ? '14px' : '16px'
                    }}>COMPANY</h4>
                    {['About', 'Features', 'Works', 'Career'].map((item) => (
                        <Link key={item} to="/" style={footerLinkStyle}>{item}</Link>
                    ))}
                </div>

                {/* Help */}
                <div>
                    <h4 style={{
                        fontWeight: '700',
                        marginBottom: '16px',
                        letterSpacing: '1px',
                        fontSize: isMobile ? '14px' : '16px'
                    }}>HELP</h4>
                    {['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                        <Link key={item} to="/" style={footerLinkStyle}>{item}</Link>
                    ))}
                </div>

                {/* FAQ */}
                <div>
                    <h4 style={{
                        fontWeight: '700',
                        marginBottom: '16px',
                        letterSpacing: '1px',
                        fontSize: isMobile ? '14px' : '16px'
                    }}>FAQ</h4>
                    {['Account', 'Manage Deliveries', 'Orders', 'Payments'].map((item) => (
                        <Link key={item} to="/" style={footerLinkStyle}>{item}</Link>
                    ))}
                </div>

                {/* Resources */}
                <div>
                    <h4 style={{
                        fontWeight: '700',
                        marginBottom: '16px',
                        letterSpacing: '1px',
                        fontSize: isMobile ? '14px' : '16px'
                    }}>RESOURCES</h4>
                    {['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'].map((item) => (
                        <Link key={item} to="/" style={footerLinkStyle}>{item}</Link>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                borderTop: '1px solid #e5e5e5',
                padding: isMobile ? '16px' : '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '12px' : '0',
            }}>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    Shop.co © 2000-2023, All Rights Reserved
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['VISA', 'MC', 'PayPal', 'APay', 'GPay'].map((pay) => (
                        <span key={pay} style={{
                            border: '1px solid #e5e5e5',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>{pay}</span>
                    ))}
                </div>
            </div>
        </footer>
    );
}

const footerLinkStyle = {
    display: 'block',
    textDecoration: 'none',
    color: '#666',
    fontSize: '14px',
    marginBottom: '12px',
};

export default Footer;