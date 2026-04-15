import { createBrowserRouter } from 'react-router';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    Component: Welcome,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/auth/callback',
    Component: AuthCallback,
  },
  // Protected routes — redirect to /login if not signed in
  {
    Component: ProtectedRoute,
    children: [
      {
        path: '/onboarding',
        Component: Onboarding,
      },
      {
        path: '/discover',
        Component: Discover,
      },
      {
        path: '/matches',
        Component: Matches,
      },
      {
        path: '/profile',
        Component: Profile,
      },
      {
        path: '/admin',
        Component: Admin,
      },
    ],
  },
]);
