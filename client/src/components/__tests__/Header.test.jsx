import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { Header } from '../Header';

vitest.mock('react-router-dom', async () => {
  const actual = await vitest.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vitest.fn(),
  };
});

vitest.mock('../../stores/useAuthStore');

describe('Header', () => {
  let navigateMock;
  let logoutMock;

  beforeEach(() => {
    navigateMock = vitest.fn();
    logoutMock = vitest.fn();
    vitest.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  afterEach(() => {
    vitest.clearAllMocks();
  });

  it('renders the header for an authenticated user', () => {
    useAuthStore.mockReturnValue({
      username: 'testuser',
      avatar: 'http://avatar.url',
      steamId: '76561198000000000',
      token: 'jwt_token',
      isInitialized: true,
      isAuthenticated: true,
      logout: logoutMock,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Beeps SteamHelper')).toBeInTheDocument();
    expect(screen.getAllByText('Статистика')).toHaveLength(2);
    expect(screen.getAllByText('Рекомендації')).toHaveLength(2);
    expect(screen.getAllByText('Обрані')).toHaveLength(2);
    expect(screen.getAllByText('Профіль')).toHaveLength(2);
    expect(screen.getAllByText('testuser')).toHaveLength(2);
    expect(screen.getAllByText('Вийти')).toHaveLength(2);
  });

  it('renders the header for a non-authenticated user with viewed profile', () => {
    useAuthStore.mockReturnValue({
      username: 'testuser',
      avatar: 'http://avatar.url',
      steamId: '76561198000000000',
      token: null,
      isInitialized: true,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getAllByText('testuser (перегляд)')).toHaveLength(2);
    expect(screen.queryByText('Обрані')).not.toBeInTheDocument();
    expect(screen.queryByText('Вийти')).not.toBeInTheDocument();
  });

  it('handles logout', () => {
    useAuthStore.mockReturnValue({
      username: 'testuser',
      avatar: 'http://avatar.url',
      steamId: '76561198000000000',
      token: 'jwt_token',
      logout: logoutMock,
      isInitialized: true,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutButton = screen.getAllByText('Вийти')[0];
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});