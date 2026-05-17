import React from 'react';

interface ApiErrorFallbackProps {
  readonly message?: string;
  readonly onRetry: () => void;
}

export function ApiErrorFallback({ message, onRetry }: ApiErrorFallbackProps) {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        backgroundColor: '#1c1c1c',
        border: '1px solid #333',
        borderRadius: '8px',
        margin: '20px 4%',
        textAlign: 'center'
      }}
      data-testid="api-error-fallback"
    >
      <p style={{ color: '#E50914', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>
        🍿 Ops! Não foi possível carregar esta seção
      </p>
      <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '16px' }}>
        {message || 'Verifique sua conexão ou tente novamente.'}
      </p>
      <button 
        onClick={onRetry}
        style={{
          padding: '8px 20px',
          backgroundColor: '#E50914',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        className="hover:bg-red-700 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
