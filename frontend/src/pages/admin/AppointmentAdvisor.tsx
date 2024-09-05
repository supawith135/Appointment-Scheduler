import React from 'react'
import Header from '../../layout/Header'
import AdminNavbar from '../../layout/AdminNavbar'
import Footer from '../../layout/Footer'
import CalenderAdvisor from '../../component/admin/CalendarAdvisor'

function AppointAdvisor() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <AdminNavbar />
            <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
                        Advisor Appointment Page
                    </h1>
                    <CalenderAdvisor/>
                </div>
            </main>
            <Footer />
        </div>
    )
}
export default AppointAdvisor