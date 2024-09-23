import React from 'react'
import sutLogoWhite from '../../assets/ENGi Lettermark-EN-White.png'

// import Logout from '../components/Logout'
import { useNavigate } from 'react-router-dom'

function HeaderPage() {
    // const navigate = useNavigate();
    // const handleClickImage = () => {
    //     navigate('/')
    // }

    return (
        // <header className='flex h-20 py-6 bg-ENGi-Red  items-center'>
        //     <div className='w-1/2  hidden sm:block'>
        //         <img src={sutLogoWhite} alt='sutLogoWhite' className='max-w-56 ml-10'></img>
        //     </div>
        //     {/* <div className='w-4/12'></div> */}
        //     <div className='w-1/2 flex justify-end mr-5 gap-4 items-center'>
        //         <div className='flex  text-xl text-white '>
        //             B6432140 ศุภวิชญ์ อยู่นิยม
        //         </div>
        //         <Menu />
        //         <Logout />

        //     </div>
        // </header>
        <div className="navbar bg-ENGi-Red">
            <div className="flex-1">
                <div className='w-1/2  hidden sm:block'>
                    <img src={sutLogoWhite} alt='sutLogoWhite' className='max-w-56 ml-10'  ></img>
                </div>
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    <div className='flex  text-xl text-white '>
                        Test
                    </div>
                </div>
                {/* <Menu/> */}
            </div>
        </div>
    )
}

export default HeaderPage