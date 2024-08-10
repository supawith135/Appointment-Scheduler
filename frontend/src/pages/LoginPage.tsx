import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../layout/Header"
import Footer from "../layout/Footer"
import CPE from "../assets/CPE_logo.jpg"


interface User {
    role: string;
    password: string;
}

const users: Record<string, User> = {
    sut123: { role: 'teacher', password: 'sut321' },
    B643210: { role: 'student', password: 'B123' },
    adminsut: { role: 'admin', password: 'admin' },
};


function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = () => {
        const user = users[username];
        if (user && user.password === password) {
            localStorage.setItem('user', JSON.stringify(user));
            navigate(`/${user.role}`);
        } else {
            setError('Invalid credentials');
        }
    };
    return (
        <>
            <div className='min-h-screen flex flex-col'>
                <Header />
                <div className='flex flex-grow bg-white'>
                    <div className='mt-10 mx-center flex flex-col gap-y-4 items-center '>
                        <div className='w-2/4'>
                            <img src={CPE} alt="CPE Logo"></img>
                        </div>
                        <div className='flex flex-col-reverse sm:flex-row justify-center gap-6 font-Kanit '>
                            <div className='bg-white shadow-2xl rounded-md p-5 box-border w-96'>

                                <p className='text-center text-2xl text-orange-400'>วิธีการเข้าสู่ระบบ</p>

                                <p className='text-lx  text-gray-600 mt-2'>อาจารย์</p>
                                <p className='text-sm  text-gray-400 ml-6'>• ชื่อผู้ใช้ : SUT123</p>
                                <p className='text-sm  text-gray-400 ml-6'>• รหัสผ่าน : SUT123</p>

                                <p className='text-lx  text-gray-600 mt-2'>นักศึกษา</p>
                                <p className='text-sm  text-gray-400 ml-6'>• ชื่อผู้ใช้ : B64xxxxx</p>
                                <p className='text-sm  text-gray-400 ml-6'>• รหัสผ่าน : B64xxxxx</p>

                                <p className='text-lx  text-gray-600 mt-2'>แอดมิน</p>
                                <p className='text-sm  text-gray-400 ml-6'>• ชื่อผู้ใช้ : Admin123</p>
                                <p className='text-sm  text-gray-400 ml-6'>• รหัสผ่าน : Admin123</p>

                            </div>
                            <div className='bg-white shadow-2xl rounded-md p-5 box-border w-96'>
                                <p className='text-center text-2xl text-orange-400'>กรุณาเข้าสู่ระบบ</p>
                                <div className='mb-4'>
                                    <label htmlFor='username' className='block text-lg font-medium text-gray-500 mb-2'>
                                        ชื่อผู้ใช้
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='กรุณากรอกชื่อผู้ใช้......'
                                        id='username'
                                        name='username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='w-full p-2 bg-white border border-orange-300  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label htmlFor='username' className='block text-lg font-medium text-gray-500 mb-2'>
                                        รหัสผ่าน
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='กรุณากรอกชื่อผู้ใช้......'
                                        id='password'
                                        name='password'

                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='w-full p-2 bg-white border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
                                    />
                                </div>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <div className='flex justify-center'>
                                    <button className="border border-orange-300 rounded-md px-5 py-2 font-Kanit text-orange-400 hover:bg-orange-400 hover:text-white" onClick={handleLogin}>
                                        เข้าสู่ระบบ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
export default Login
