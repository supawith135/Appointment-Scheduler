import React from 'react';
import Header from '../../layout/Header';
import TeacherNavbar from '../../layout/TeacherNavbar';
import Footer from '../../layout/Footer';
import TeacherHistoryTable from '../../component/teacher/TeacherHistoryTable';
import TeacherDashboard from '../../component/teacher/TeacherDashboard';

function TeacherHistoryPage() {
    return (
        <div className="w-screen flex flex-col bg-white">
            <Header />
            <TeacherNavbar />
            <div className="flex flex-grow flex-col  my-4 gap-3">
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <TeacherDashboard />   
                </div>
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <TeacherHistoryTable />           
                </div>
            </div>  
            <Footer />  
        </div>
    );
}

export default TeacherHistoryPage;
 