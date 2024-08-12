import React from 'react'
import Header from '../../layout/Header'
import TeacherNavbar from '../../layout/TeacherNavbar'

import Footer from '../../layout/Footer'

function TeacherAppointmentPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white ">
            <Header />
            <TeacherNavbar />
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

export default TeacherAppointmentPage