//Image CPE
import CPE from '../assets/CPE_logo.jpg'


function Login() {
    return (
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
                            className='w-full p-2 bg-white border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
                        />
                    </div>
                    <div className='flex justify-center'>
                        <button className="border border-orange-300 rounded-md px-5 py-2 font-Kanit text-orange-400 hover:bg-orange-400 hover:text-white">
                            เข้าสู่ระบบ
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login