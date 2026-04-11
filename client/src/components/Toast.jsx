import React, { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: { bg: '#f0fff4', border: '#00c853', icon: '✅', text: '#000' },
        error: { bg: '#ffe5e5', border: '#ff3333', icon: '❌', text: '#000' },
        warning: { bg: '#fff8e1', border: '#ffc107', icon: '⚠️', text: '#000' },
        info: { bg: '#e3f2fd', border: '#2196f3', icon: 'ℹ️', text: '#000' },
    };

    const style = colors[type] || colors.success;

    return (
        <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: style.bg,
            border: `1px solid ${style.border}`,
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: '280px',
            maxWidth: '380px',
            animation: 'slideIn 0.3s ease',
        }}>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
            <span style={{ fontSize: '20px' }}>{style.icon}</span>
            <p style={{
                flex: 1,
                fontSize: '14px',
                fontWeight: '600',
                color: style.text,
                margin: 0,
            }}>
                {message}
            </p>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666',
                    padding: '0',
                    lineHeight: 1,
                }}>
                ✕
            </button>
        </div>
    );
}

export default Toast;