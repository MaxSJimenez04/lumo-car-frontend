import React from 'react';

export default function Loading({ message = "Cargando información...", fullPage = false }) {
    return (
        <div className={`global-loading-container ${fullPage ? 'full-page' : ''}`}>
            <div className="global-loading-spinner"></div>
            <p className="global-loading-text">{message}</p>
        </div>
    );
}
