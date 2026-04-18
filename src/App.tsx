import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store/store';
import { checkAuth } from './store/slices/authSlice';

import Layout from './components/ui/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/HomePage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ActivatePage from './pages/auth/ActivatePage';
import { ProjectDetailsPage } from './pages/project-details/project-details';
import { DonationPage } from './pages/project-details/donation-form';
const router = createBrowserRouter([
  {
    path: 'activate/:token',
    element: <ActivatePage />, // standalone page — no navbar/footer
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path:'projects/:id',
        element:<ProjectDetailsPage />
      },
      {
        path:'projects/:id/donate',
        element:<DonationPage />
      },
      // any route nested under this wrapper needs auth
      {
        element: <ProtectedRoute />,
        children: [
          //for ex: { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // verify httpOnly cookies on app mount (page load / refresh)
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
