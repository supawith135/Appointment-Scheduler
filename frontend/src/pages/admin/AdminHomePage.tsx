import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import NavbarV2 from '../../layout/AdminNavbar';

function AdminHomePage() {


    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <NavbarV2 />
            <div className='flex flex-grow m-auto'>
                <div className='text-2xl m-auto'>
                    Admin HomePage
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminHomePage