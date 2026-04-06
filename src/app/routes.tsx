import { createBrowserRouter } from 'react-router';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Profile from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Welcome,
  },
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
]);
