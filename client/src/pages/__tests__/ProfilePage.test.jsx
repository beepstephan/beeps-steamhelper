import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useProfileStore } from '../../stores/useProfileStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { ProfilePage } from '../ProfilePage';

vitest.mock('../../stores/useAuthStore');
vitest.mock('../../stores/useProfileStore');
vitest.mock('../../stores/useFavoritesStore');

describe('ProfilePage', () => {
  const authStoreMock = {
    username: 'testuser',
    steamId: '76561198000000000',
    avatar: 'http://avatar.url',
    games: [
      { name: 'Game1', playtime: 100, playtime_2weeks: 10, genre: 'Action', isMultiplayer: true, isMixed: false },
    ],
    totalGames: 1,
    activity: { last3Days: 2, last2Weeks: 15, lastMonth: 30 },
    token: 'jwt_token',
    isAuthenticated: true,
    isLoading: false,
    error: null,
    isInitialized: true,
    viewProfile: vitest.fn(),
  };

  const profileStoreMock = {
    recommendations: [{ appid: 123, name: 'RecommendedGame1', comment: 'Great game' }],
    favoriteGenres: [{ genre: 'Action', percentage: 67 }],
    mood: 'Легкий відпочинок',
    status: 'online',
    multiplayerStats: { multiplayerTime: 100, singleplayerTime: 50, mixedTime: 0 },
    isLoading: false,
    error: null,
    fetchProfileExtras: vitest.fn(),
  };

  const favoritesStoreMock = {
    favorites: [{ appid: 123, name: 'RecommendedGame1', imageUrl: 'http://image.url' }],
    fetchFavorites: vitest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    useAuthStore.mockReturnValue(authStoreMock);
    useProfileStore.mockReturnValue(profileStoreMock);
    useFavoritesStore.mockReturnValue(favoritesStoreMock);
  });

  it('renders the profile page for the authenticated user', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    const profileSection = screen.getByText('SteamID: 76561198000000000').closest('div');
    expect(within(profileSection).getByText('testuser')).toBeInTheDocument();

    expect(screen.getByText('SteamID: 76561198000000000')).toBeInTheDocument();
    expect(screen.getByText('Статус: Онлайн')).toBeInTheDocument();

    const totalGamesElement = screen.getByText('Всього ігор:');
    expect(within(totalGamesElement.parentElement).getByText('1')).toBeInTheDocument();

    const topGamesSection = screen.getByText('Топ-5 ігор').closest('div');
    expect(within(topGamesSection).getByText(/Game1\s*-/)).toBeInTheDocument();

    expect(screen.getByText('Улюблені ігри')).toBeInTheDocument();
    expect(screen.getByText('RecommendedGame1')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    useAuthStore.mockReturnValue({ ...authStoreMock, isLoading: true });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('pulse-loader')).toBeInTheDocument();
  });
});