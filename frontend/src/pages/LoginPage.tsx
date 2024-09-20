import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogInInterface } from '../interfaces/ILogIn';
import { LogIn } from '../services/https/logIn/logIn';
import LoginHeader from "../layout/LoginHeader";
import Footer from "../layout/Footer";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = MuiAlert;

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const values: LogInInterface = { user_name: username, password: password };

    try {
      const res = await LogIn(values);
      if (res.status === 200) {
        // Show success notification
        setMessage('Sign-in Successful');
        setSeverity('success');
        setOpen(true);

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token_type", res.data.token_type);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("role", res.data.role);  // Store role in localStorage

        const role = res.data.role;

        setTimeout(() => {
          // Redirect based on role
          if (role === 'student') {
            navigate('/Student');
          } else if (role === 'teacher') {
            navigate('/Teacher');
          } else if (role === 'admin') {
            navigate('/Admin');
          } else {
            navigate('/');  // Fallback in case of unknown role
          }
        }, 2000);
      } else {
        // Show error notification
        setMessage(res.data.error || 'An error occurred during login');
        setSeverity('error');
        setOpen(true);
        setError(res.data.error);
      }
    } catch (error) {
      // Handle unexpected errors
      setMessage('An unexpected error occurred. Please try again.');
      setSeverity('error');
      setOpen(true);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className='min-h-screen flex flex-col bg-white'>
        <LoginHeader />
        <div className='flex flex-grow bg-white'>
          <div className='my-auto flex flex-col gap-y-4 m-auto'>
            <div className='flex flex-col-reverse sm:flex-row justify-center gap-6'>
              <div className='bg-white shadow-2xl rounded-md p-5 box-border w-96'>
                <p className='text-center text-2xl text-ENGi-Red'>วิธีการเข้าสู่ระบบ</p>
                {/* Instructions for different user roles */}
                <p className='text-lx text-SUT-Grey mt-2'>อาจารย์</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : Sompong</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : a123456</p>

                <p className='text-lx text-SUT-Grey mt-2'>นักศึกษา</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : B6412345</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : b123456</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : DekDeeVstart</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : a123456</p>

                <p className='text-lx text-SUT-Grey mt-2'>แอดมิน</p>
                <p className='text-sm text-gray-400 ml-6'>• ชื่อผู้ใช้ : Admin</p>
                <p className='text-sm text-gray-400 ml-6'>• รหัสผ่าน : admin123456</p>
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
                    className='w-full p-2 bg-white border border-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ENGi-Red'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='password' className='block text-lx text-gray-500 mb-2'>
                    รหัสผ่าน
                  </label>
                  <input
                    type='password'
                    placeholder='กรุณากรอกรหัสผ่าน......'
                    id='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full p-2 bg-white border border-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ENGi-Red'
                  />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className='flex justify-center'>
                  <button
                    className="border border-red-700 rounded-md px-5 py-2 text-ENGi-Red hover:bg-ENGi-Red hover:text-white"
                    onClick={handleLogin}
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* MUI Snackbar for notifications */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position Snackbar at top-right
      >
        <Alert onClose={handleClose} variant="filled" severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
