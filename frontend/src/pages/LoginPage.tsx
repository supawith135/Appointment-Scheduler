import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginHeader from "../layout/LoginHeader"
import Footer from "../layout/Footer"


interface User {
    role: string;
    password: string;
}

const users: Record<string, User> = {
    sut123: { role: 'teacher', password: 'sut123' },
    user123: { role: 'student', password: 'user123' },
    admin123: { role: 'admin', password: 'admin123' },
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
            <div className='min-h-screen flex flex-col bg-white'>
                <LoginHeader />
                <div className='flex flex-grow bg-white'>
                    <div className='my-auto flex flex-col gap-y-4 m-auto '> 
                        <div className='flex flex-col-reverse sm:flex-row justify-center gap-6 '>
                            <div className='bg-white shadow-2xl rounded-md p-5 box-border w-96'>

                                <p className='text-center text-2xl text-ENGi-Red'>วิธีการเข้าสู่ระบบ</p>

                                <p className='text-lx  text-SUT-Grey mt-2'>อาจารย์</p>
                                <p className='text-sm  text-gray-400 ml-6'>• ชื่อผู้ใช้ : sut123</p>
                                <p className='text-sm  text-gray-400 ml-6'>• รหัสผ่าน : sut123</p>

                                <p className='text-lx  text-SUT-Grey mt-2'>นักศึกษา</p>
                                <p className='text-sm  text-gray-400 ml-6'>• ชื่อผู้ใช้ : user123</p>
                                <p className='text-sm  text-gray-400 ml-6'>• รหัสผ่าน : user123</p>

                                <p className='text-lx  text-SUT-Grey mt-2'>แอดมิน</p>
                                <p className='text-sm  text-gray-400 ml-6'>• ชื่อผู้ใช้ : admin123</p>
                                <p className='text-sm  text-gray-400 ml-6'>• รหัสผ่าน : admin123</p>

                            </div>
                            <div className='bg-white shadow-2xl rounded-md p-5 box-border w-96'>
                                <p className='text-center text-2xl text-ENGi-Red'>กรุณาเข้าสู่ระบบ</p>
                                <div className='mb-4'>
                                    <label htmlFor='username' className='block text-lx text-gray-500 mb-2'>
                                        ชื่อผู้ใช้
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='กรุณากรอกชื่อผู้ใช้......'
                                        id='username'
                                        name='username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='w-full p-2 bg-white border border-red-700  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ENGi-Red'
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label htmlFor='username' className='block text-lx text-gray-500 mb-2'>
                                        รหัสผ่าน
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='กรุณากรอกชื่อผู้ใช้......'
                                        id='password'
                                        name='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='w-full p-2 bg-white border border-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ENGi-Red'
                                    />
                                </div>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <div className='flex justify-center'>
                                    <button className="border border-red-700 rounded-md px-5 py-2  text-ENGi-Red hover:bg-ENGi-Red hover:text-white" onClick={handleLogin}>
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
