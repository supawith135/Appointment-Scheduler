import React from 'react'
import Header from '../../layout/Header'
import StudentNavbar from '../../layout/StudentNavbar'
import Footer from '../../layout/Footer'
import AppointmentCalendar from '../../component/student/AppointmentCalendar'

function StudentAppointmentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <StudentNavbar />
      <main className="flex-grow p-4 sm:p-6 lg:p-10 items-center bg-white ">
        <div className="max-w-4xl mx-auto">
          {/* <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
            Student Appointment Page
          </h1> */}
          <div className='flex justify-center'>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-red-700 mb-6 lg:mb-10 text-center">
              เลือกเวลาจองคิวนัดหมาย
            </p>
          </div>
          <AppointmentCalendar />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StudentAppointmentPage
