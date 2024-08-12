import React from 'react'
import Header from '../../layout/Header'
import StudentNavbar from '../../layout/StudentNavbar'
import StudentHistoryTable from '../../component/student/StudentHistoryTable'
import Footer from '../../layout/Footer'

function StudenAppointmentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <StudentNavbar/>
      <main className="flex-grow p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-Kanit text-center mb-6 text-orange-400">
           Studen Appointment Page
          </h1>
       
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StudenAppointmentPage