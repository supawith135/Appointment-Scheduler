import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './routers/ProtectRoute'
import TeacherHomePage from './pages/teacher/TeacherHomePage'
import StudentHomePage from './pages/student/StudentHomePage'
import AdminHomePage from './pages/admin/AdminHomePage'
import StudentHistoryPage from './pages/student/StudentHistoryPage'
import TeacherHistoryPage from './pages/teacher/TeacherHistoryPage'

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <App/>,
  // },
  // {
  //   path: "/home",
  //   element: <HomePage/>,
  // },
  // {
  //   path: "/profile",
  //   element: <ProfilePage/>,
  // },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/teacher',
        element: <ProtectedRoute role="teacher" />,
        children: [
          { path: '', element: <TeacherHomePage /> },
          { path: 'history', element: <TeacherHistoryPage /> },
        ],
      },
      {
        path: '/student',
        element: <ProtectedRoute role="student" />,
        children: [
          { path: '', element: <StudentHomePage /> },
          { path: 'history', element: <StudentHistoryPage /> },
        ],
      },
      {
        path: '/admin',
        element: <ProtectedRoute role="admin" />,
        children: [
          { path: '', element: <AdminHomePage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
