import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './css/index.css';
import App from './App.jsx';

import LandingPage from './pages/LandingPage.jsx';
import Questions from './pages/Questions.jsx';
import Home from './pages/Home.jsx';
import ErrorPage from './pages/Error.jsx';
import Settings from './pages/Settings.jsx';
import AddExpense from './pages/AddExpense.jsx';
import HomeBudget from './pages/HomeBudget.jsx';
import UpdateFinances from './pages/UpdateFinances.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/questions',
        element: <Questions />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/error',
        element: <ErrorPage />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '/addexpense',
        element: <AddExpense />
      },
      {
        path: '/home_budget',
        element: <HomeBudget />
      },
      {
        path: '/update_finances',
        element: <UpdateFinances />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);