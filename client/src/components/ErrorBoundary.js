import React from 'react';

function ErrorBoundary({ error }) {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '4px' }}>
            <h2>Error: {error.name}</h2>
            <p>Message: {error.message}</p>
            {error.stack ? <p>Stack trace: {error.stack}</p> : null}
        </div>
    );
}

export default ErrorBoundary;