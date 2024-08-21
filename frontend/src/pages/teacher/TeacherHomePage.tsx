import React from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';

import Footer from '../../layout/Footer';
import TeacherNavbar from '../../layout/TeacherNavbar';

function TeacherHomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <TeacherNavbar />
            <div className='flex flex-grow m-auto'>
                <div className='text-2xl m-auto font-NotoSans'>
                    Tacher HomePage
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TeacherHomePage