import React from 'react'
import { TbUsers } from "react-icons/tb";
import { TbUserCheck } from "react-icons/tb";
import { LuCalendarRange } from "react-icons/lu";
function TeacherDashboard() {
    return (
        <div>
            <div className='flex p-5 bg-white border-white rounded-md items-center shadow-lg'>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-row justify-between items-center '>
                        <div className='bg-green-200 p-4 rounded-full'>
                            <TbUsers className='stroke-green-600 size-6' />
                        </div>
                        <div className='mx-4'>
                            <ul>
                                <li className='text-sm font-Kanit'>จำนวนนักศึกษาทั้งสาขา</li>
                                <li className='text-2xl font-Kanit text-black'>250</li>
                            </ul>
                        </div>
                        <div className='bg-green-200 p-4 rounded-full'>
                            <TbUserCheck className='stroke-green-600 size-6' />
                        </div>
                        <div className='mx-4'>
                            <ul>
                                <li className='text-sm font-Kanit'>จำนวนนักศึกษาที่ดูแล</li>
                                <li className='text-2xl font-Kanit text-black'>25</li>
                            </ul>
                        </div>
                        <div className='bg-green-200 p-4 rounded-full'>
                            <LuCalendarRange className='stroke-green-600 size-6' />
                        </div>
                        <div className='mx-4'>
                            <ul>
                                <li className='text-sm font-Kanit'>นัดหมายทั้งหมด</li>
                                <li className='text-2xl font-Kanit text-black'>15</li>
                            </ul>
                        </div>
                        <div className='bg-yellow-200 p-4 rounded-full'>
                            <LuCalendarRange className='stroke-yellow-600 size-6' />
                        </div>
                        <div className='mx-4'>
                            <ul>
                                <li className='text-sm font-Kanit'>นัดหมายที่เหลือ</li>
                                <li className='text-2xl font-Kanit text-black'>2</li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard