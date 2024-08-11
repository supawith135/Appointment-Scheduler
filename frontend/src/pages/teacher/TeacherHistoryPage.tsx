import React from 'react'
import Header from '../../layout/Header'
import TeacherNavbar from '../../layout/TeacherNavbar'
import Footer from '../../layout/Footer'
import TeacherHistoryTable from '../../component/teacher/TeacherHistoryTable'
import TeacherDashboard from '../../component/teacher/TeacherDashboard'
import TestNavbar from '../../layout/TestNavbar'


function TeacherHistoryPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            {/* <TestNavbar username="John Doe" role="Administrator"/> */}
            <TeacherNavbar />
            <div className='flex flex-grow flex-col m-auto my-4'>
                <div className='mb-4'>
                    <TeacherDashboard />
                </div>
                <div className=''>
                    <TeacherHistoryTable />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default TeacherHistoryPage