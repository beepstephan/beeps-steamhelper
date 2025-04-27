import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LinkInputPage } from '../LinkInputPage';

global.fetch = vitest.fn();

describe('LinkInputPage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the form and title', () => {
    render(
      <MemoryRouter>
        <LinkInputPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Вставте посилання на Steam-профіль...')).toBeInTheDocument();
    expect(screen.getByText('Увійти через Steam')).toBeInTheDocument();
    expect(screen.getByText('Переглянути')).toBeInTheDocument();
  });

  it('shows error for invalid Steam link', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Server error' }),
      })
    );

    render(
      <MemoryRouter>
        <LinkInputPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Вставте посилання на Steam-профіль...');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'invalid-link', name: 'steamLink' } });
    fireEvent.submit(form, { target: { steamLink: { value: 'invalid-link' } } });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Введіть коректне посилання на Steam-профіль');
    });
  });

  it('has correct href for "Увійти через Steam" button', () => {
    render(
      <MemoryRouter>
        <LinkInputPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByText('Увійти через Steam');
    expect(loginButton).toHaveAttribute('href', `${import.meta.env.VITE_API_URL}/auth/steam`);
  });
});