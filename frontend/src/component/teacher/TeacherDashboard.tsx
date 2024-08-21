import React from 'react';
import { TbUsers, TbUserCheck } from "react-icons/tb";
import { LuCalendarRange } from "react-icons/lu";

function TeacherDashboard() {
    return (
        <div className='sm:p-6 lg:p-10'>
            <div className='bg-white border border-gray-200 rounded-md shadow-lg p-5 font-NotoSans'>
                <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {/* Section 1 */}
                    <div className='flex items-center p-4 bg-green-100 rounded-lg'>
                        <div className='bg-green-200 p-3 rounded-full'>
                            <TbUsers className='text-green-600 text-3xl' />
                        </div>
                        <div className='ml-4'>
                            <ul>
                                <li className='text-sm font-medium text-gray-700'>นักศึกษาทั้งสาขา</li>
                                <li className='text-2xl font-bold text-black'>250</li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Section 2 */}
                    <div className='flex items-center p-4 bg-green-100 rounded-lg'>
                        <div className='bg-green-200 p-3 rounded-full'>
                            <TbUserCheck className='text-green-600 text-3xl' />
                        </div>
                        <div className='ml-4'>
                            <ul>
                                <li className='text-sm font-medium text-gray-700'>นักศึกษาที่ดูแล</li>
                                <li className='text-2xl font-bold text-black'>25</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className='flex items-center p-4 bg-green-100 rounded-lg'>
                        <div className='bg-green-200 p-3 rounded-full'>
                            <LuCalendarRange className='text-green-600 text-3xl' />
                        </div>
                        <div className='ml-4'>
                            <ul>
                                <li className='text-sm font-medium text-gray-700'>นัดหมายทั้งหมด</li>
                                <li className='text-2xl font-bold text-black'>15</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className='flex items-center p-4 bg-yellow-100 rounded-lg'>
                        <div className='bg-yellow-200 p-3 rounded-full'>
                            <LuCalendarRange className='text-yellow-600 text-3xl' />
                        </div>
                        <div className='ml-4'>
                            <ul>
                                <li className='text-sm font-medium text-gray-700'>นัดหมายที่เหลือ</li>
                                <li className='text-2xl font-bold text-black'>2</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
