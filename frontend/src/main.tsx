import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MobileApp.css';
import { AppLayout } from './AppLayout';
import { ServicesPage } from './pages/ServicesPage';
import { DetailPage } from './pages/DetailPage';
import { ROUTES } from './Routes';

const router = createBrowserRouter([{
  element: <AppLayout />,
  children: [
    { path: ROUTES.LIST, element: <ServicesPage /> },
    { path: `${ROUTES.DETAIL}/:id`, element: <DetailPage /> },
    { path: '*', element: <section className="listPage"><h1>Страница не найдена</h1>
        <Link to={ROUTES.LIST}>К расчётам</Link></section> },
  ],
}]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>,
);
