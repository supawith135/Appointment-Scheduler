import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './routers/ProtectRoute'
import StudentHomePage from './pages/student/StudentHomePage'
import AdminHomePage from './pages/admin/AdminHomePage'
import StudentHistoryPage from './pages/student/StudentHistoryPage'
import TeacherHistoryPage from './pages/teacher/TeacherHistoryPage'
import AddStudentListPage from './pages/admin/AddStudentListPage'
import StudenAppointmentPage from './pages/student/StudentBookingAdvisorPage'
import TeacherCreateTimeSlotPage from './pages/teacher/TeacherCreateTimeSlotPage'
import TeacherAppointmentPage from './pages/teacher/TeacherAppointmentPage'
import AddTeacherListPage from './pages/admin/AddTeacherListPage'
import StudentListPage from './pages/admin/StudentListPage'
import TecherListPage from './pages/admin/TeacherListPage'
import AppointmentTeacherPage from './pages/admin/AppointmentTeacherPage'
import { LicenseInfo } from '@mui/x-license';
import StudentDetailsPage from './pages/teacher/StudentDetailsPage'
import StudentProfile from './pages/student/StudentProfile'
import AdminProfile from './pages/admin/AdminProfile'
import TeacherProfile from './pages/teacher/TeacherProfile'
import StudentBookingTeacherPage from './pages/student/StudentBookingTeacherPage'
import StudentAccountPage from './pages/student/StudentAccountPage'
import TeacherAccountPage from './pages/teacher/TeacherAccountPage'
import AdminAccountPage from './pages/admin/AdminAccountPage'
import AdminTeacherDetailPage from './pages/admin/AdminTeacherDetailPage'
import AddStudentPage from './pages/admin/AddStudentPage'
import AddTeacherPage from './pages/admin/AddTeacherPage'
import StudentInChargePage from './pages/teacher/StudentInChargePage'
import TeacherStudentNotePage from './pages/teacher/TeacherStudentNotePage'
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');
const router = createBrowserRouter([
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
          { path: '', element: <TeacherAppointmentPage /> },
          { path: 'CreateTimeSlot', element: <TeacherCreateTimeSlotPage /> },
          { path: 'History', element: <TeacherHistoryPage /> },
          { path: 'StudentBookingDetails/:user_name', element: <StudentDetailsPage /> },
          { path: 'Profile', element: <TeacherProfile /> },
          { path: 'Account', element: <TeacherAccountPage /> },
          { path: 'StudentInCharge', element: <StudentInChargePage /> },
          { path: 'StudentNote', element: <TeacherStudentNotePage /> },
          
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
          { path: 'bookingTeacher/:id', element: <StudentBookingTeacherPage /> },
          { path: 'Account', element: <StudentAccountPage /> },
             
        ],
      },
      {
        path: '/Admin',
        element: <ProtectedRoute role="admin" />,
        children: [
          { path: '', element: <AdminHomePage /> },
          { path: 'AddStudentList', element: <AddStudentListPage /> },
          { path: 'AddTeacherList', element: <AddTeacherListPage /> },
          { path: 'StudentList', element: <StudentListPage /> },
          { path: 'TeacherList', element: <TecherListPage /> },
          { path: 'bookingTeacher/:id', element: <AppointmentTeacherPage /> },
          { path: 'Profile', element: <AdminProfile /> },
          { path: 'Account', element: <AdminAccountPage /> },
          { path: 'teacherDetail/:id', element: <AdminTeacherDetailPage /> },
          { path: 'AddStudent', element: <AddStudentPage /> },
          { path: 'AddTeacher', element: <AddTeacherPage /> },     
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
