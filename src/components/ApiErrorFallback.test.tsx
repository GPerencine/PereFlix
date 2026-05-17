import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiErrorFallback } from './ApiErrorFallback';

describe('ApiErrorFallback Component', () => {
  it('renders the default error message when no message prop is provided', () => {
    render(<ApiErrorFallback onRetry={jest.fn()} />);

    expect(screen.getByText(/Ops! Não foi possível carregar esta seção/i)).toBeInTheDocument();
    expect(screen.getByText(/Verifique sua conexão ou tente novamente/i)).toBeInTheDocument();
  });

  it('renders a custom message when message prop is provided', () => {
    render(<ApiErrorFallback message="Erro de rede customizado." onRetry={jest.fn()} />);

    expect(screen.getByText('Erro de rede customizado.')).toBeInTheDocument();
  });

  it('renders the retry button', () => {
    render(<ApiErrorFallback onRetry={jest.fn()} />);

    expect(screen.getByRole('button', { name: /Tentar Novamente/i })).toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', () => {
    const onRetryMock = jest.fn();
    render(<ApiErrorFallback onRetry={onRetryMock} />);

    const button = screen.getByRole('button', { name: /Tentar Novamente/i });
    fireEvent.click(button);

    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('renders the component with correct test id', () => {
    render(<ApiErrorFallback onRetry={jest.fn()} />);

    expect(screen.getByTestId('api-error-fallback')).toBeInTheDocument();
  });
});
