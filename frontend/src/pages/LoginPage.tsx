import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogInInterface } from '../interfaces/ILogIn';
import { LogIn } from '../services/https/logIn/logIn';
import LoginHeader from "../components/shared/LoginHeader";
import Footer from "../components/shared/Footer";
import { CheckCircle, XCircle, User, Lock, AlertCircle } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: NotificationType }>({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    let hasError = false;
    if (!username) {
      setUsernameError('กรุณากรอกชื่อผู้ใช้');
      hasError = true;
    } else {
      setUsernameError('');
    }
    if (!password) {
      setPasswordError('กรุณากรอกรหัสผ่าน');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    const values: LogInInterface = { user_name: username, password: password };

    try {
      const res = await LogIn(values);
      if (res.status === 200) {
        showNotification('เข้าสู่ระบบสำเร็จ!', 'success');
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token_type", res.data.token_type);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("role", res.data.role);

        setTimeout(() => {
          const role = res.data.role;
          if (role === 'student') navigate('/Student');
          else if (role === 'teacher') navigate('/Teacher');
          else if (role === 'admin') navigate('/Admin');
          else navigate('/');
        }, 2000);
      } else {
        showNotification(res.data.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'error');
      }
    } catch (error) {
      showNotification('เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง', 'error');
    }
  };

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const inputVariants = {
    error: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } },
    normal: { x: 0 },
  };

  const iconVariants = {
    hover: { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } },
    tap: { scale: 0.9 },
  };

  return (
    <>
      <div className='min-h-screen flex flex-col bg-white'>
        <LoginHeader />
        <div className='flex flex-grow bg-white'>
          <div className='my-auto flex flex-col gap-y-4 m-auto'>
            <div className='flex flex-col-reverse sm:flex-row justify-center gap-6'>
              {/* Instructions panel (unchanged) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white shadow-2xl rounded-md p-5 box-border w-96'>
                <p className='text-center text-2xl text-ENGi-Red'>วิธีการเข้าสู่ระบบ</p>
                {/* Instructions for different user roles */}
                <p className='text-lx text-SUT-Grey mt-2'>อาจารย์</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : Sompong</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : a123456</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : Alia</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : a123456</p>

                <p className='text-lx text-SUT-Grey mt-2'>นักศึกษา</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : B6412345</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : b123456</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : DekDeeVstart</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : a123456</p>

                <p className='text-lx text-SUT-Grey mt-2'>แอดมิน</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : Admin</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : admin123456</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white shadow-2xl rounded-md p-5 box-border w-96'
              >
                <p className='text-center text-2xl text-ENGi-Red mb-6'>กรุณาเข้าสู่ระบบ</p>
                <div className='mb-4 relative'>
                  <label htmlFor='username' className='block text-lx text-gray-500 mb-2'>
                    ชื่อผู้ใช้
                  </label>
                  <div className='relative'>
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'
                    >
                      <User size={20} />
                    </motion.div>
                    <motion.input
                      variants={inputVariants}
                      animate={usernameError ? "error" : "normal"}
                      type='text'
                      placeholder='กรุณากรอกชื่อผู้ใช้......'
                      id='username'
                      name='username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full p-2 pl-10 bg-white border ${usernameError ? 'border-red-500' : 'border-red-700'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ENGi-Red`}
                    />
                  </div>
                  {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                </div>
                <div className='mb-4 relative'>
                  <label htmlFor='password' className='block text-lx text-gray-500 mb-2'>
                    รหัสผ่าน
                  </label>
                  <div className='relative'>
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'
                    >
                      <Lock size={20} />
                    </motion.div>
                    <motion.input
                      variants={inputVariants}
                      animate={passwordError ? "error" : "normal"}
                      type='password'
                      placeholder='กรุณากรอกรหัสผ่าน......'
                      id='password'
                      name='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-2 pl-10 bg-white border ${passwordError ? 'border-red-500' : 'border-red-700'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ENGi-Red`}
                    />
                  </div>
                  {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                </div>
                <div className='flex justify-center'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-red-700 rounded-md px-5 py-2 text-ENGi-Red hover:bg-ENGi-Red hover:text-white transition duration-300"
                    onClick={handleLogin}
                  >
                    เข้าสู่ระบบ
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Animated Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 
              notification.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            } text-white flex items-center`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="mr-2" size={24} />
            ) : notification.type === 'error' ? (
              <XCircle className="mr-2" size={24} />
            ) : (
              <AlertCircle className="mr-2" size={24} />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default Login;
