import React from 'react'
import Header from '../../layout/Header'
import TeacherNavbar from '../../layout/TeacherNavbar'
import Footer from '../../layout/Footer'
import TeacherHistoryTable from '../../component/teacher/TeacherHistoryTable'

function StudentDetailsPage() {
  return (
    <div className="w-screen flex flex-col bg-white ">
            <Header />
            <TeacherNavbar />
            <div className="flex flex-grow flex-col  my-4 gap-3 ">
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
                        Student Details Page
                    </h1>
                </div>
                <div className='flex shadow-sm m-auto p-3 rounded-sm bg-white'>
                    <div className=''>
                        <p className='text-black font-bold'>ข้อมูลนักศึกษา
                        <li className='font-medium text-black'>B6432140 สมชาย แก่นดี</li>
                        </p > 
                        <p className='text-black font-bold mt-4'>อาจารย์ที่ปรึกษา
                        <li className='font-medium text-black'>อ.ยิ่งยง แก้วงาม</li>
                        </p>
                    </div>

                </div>
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <TeacherHistoryTable />           
                </div>
            </div>  
            <Footer />
        </div>
  )
}

export default StudentDetailsPage