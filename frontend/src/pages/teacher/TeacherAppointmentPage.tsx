import React from 'react'
import Header from '../../layout/Header'
import TeacherNavbar from '../../layout/TeacherNavbar'

import Footer from '../../layout/Footer'
import CalendarTeacher from '../../component/teacher/CalendarTeacher'

function TeacherAppointmentPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white ">
            <Header />
            <TeacherNavbar />
            <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white ">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
                        Teacher Appointment Page
                    </h1>
                    <CalendarTeacher/>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default TeacherAppointmentPage