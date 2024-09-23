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
import AddStudent from './pages/admin/AddStudentPage'
import StudenAppointmentPage from './pages/student/StudenBookingPage'
import TeacherCreateTimeSlotPage from './pages/teacher/TeacherCreateTimeSlotPage'
import TeacherAppointmentPage from './pages/teacher/TeacherAppointmentPage'
import AddTeacher from './pages/admin/AddTeacherPage'
import StudentListPage from './pages/admin/StudentListPage'
import TecherListPage from './pages/admin/TeacherListPage'
import AppointAdvisor from './pages/admin/AppointmentAdvisor'
import { LicenseInfo } from '@mui/x-license';
import StudentDetailsPage from './pages/teacher/StudentDetailsPage'
import StudentProfile from './pages/student/StudentProfile'
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');
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
        path: '/Teacher',
        element: <ProtectedRoute role="teacher" />,
        children: [
          { path: '', element: <TeacherHomePage /> },
          { path: 'A', element: <TeacherCreateTimeSlotPage /> },
          { path: 'Appointment', element: <TeacherAppointmentPage /> },
          { path: 'CreateTimeSlot', element: <TeacherCreateTimeSlotPage /> },
          { path: 'History', element: <TeacherHistoryPage /> },
          { path: 'StudentDetails/:id', element: <StudentDetailsPage /> },
        ],
      },
      {
        path: '/Student',
        element: <ProtectedRoute role="student" />,
        children: [
          { path: '', element: <StudentHomePage /> },
          { path: 'Profile', element: <StudentProfile /> },
          { path: 'bookingAdvisor', element: <StudenAppointmentPage /> },
          { path: 'History', element: <StudentHistoryPage /> },
        ],
      },
      {
        path: '/Admin',
        element: <ProtectedRoute role="admin" />,
        children: [
          { path: '', element: <AdminHomePage /> },
          { path: 'AddStudent', element: <AddStudent /> },
          { path: 'AddTeacher', element: <AddTeacher /> },
          { path: 'StudentList', element: <StudentListPage /> },
          { path: 'TeacherList', element: <TecherListPage /> },
          { path: 'AddStudentPage', element: <AppointAdvisor /> },
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
