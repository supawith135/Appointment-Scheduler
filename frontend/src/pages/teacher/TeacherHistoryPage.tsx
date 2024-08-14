import React from 'react';
import Header from '../../layout/Header';
import TeacherNavbar from '../../layout/TeacherNavbar';
import Footer from '../../layout/Footer';
import TeacherHistoryTable from '../../component/teacher/TeacherHistoryTable';
import TeacherDashboard from '../../component/teacher/TeacherDashboard';

function TeacherHistoryPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white ">
            <Header />
            <TeacherNavbar />
            <main className="flex flex-grow flex-col mx-4 my-4 md:mx-8 md:my-6 h-full bg-white">
                <section className='mb-6'>
                    <TeacherDashboard />
                </section>
                <section>
                    <TeacherHistoryTable />
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default TeacherHistoryPage;
