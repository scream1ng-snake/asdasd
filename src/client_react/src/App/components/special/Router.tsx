import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import { FC, JSX } from 'react';
import { Checker } from './AuthCheck';
import { AdminPage, BookingPage, MainPage } from '../../pages';
// @ts-ignore
window.dataLayer = window.dataLayer || []
const routes: Array<{
  path: string,
  private: boolean,
  element: JSX.Element
}> = [
    {
      path: '/',
      private: false,
      element: <MainPage />
    },
    {
      path: '/booking',
      private: false,
      element: <BookingPage />
    },
    {
      path: '/admin',
      private: false,
      element: <AdminPage />
    }
  ]

export const RouterComponent: FC = () => {
  return <BrowserRouter>
    <Routes>
      {routes.map((route) =>
        <Route
          key={route.path}
          path={route.path}
          element={
            route.private
              ? <Checker>{route.element}</Checker>
              : route.element
          }
        />
      )}
    </Routes>
  </BrowserRouter>
}