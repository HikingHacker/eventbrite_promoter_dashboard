import React from 'react';

function ErrorBoundary({ error }) {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '4px' }}>
            <h2>Error</h2>
            <p>{error}</p>
        </div>
    );
}

export default ErrorBoundary;
