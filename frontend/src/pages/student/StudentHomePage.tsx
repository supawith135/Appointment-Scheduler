import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import StudentNavbar from '../../layout/StudentNavbar';

function StudentHomePage() {

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <StudentNavbar />
            <div className='flex flex-grow m-auto'>
                <div className='text-2xl m-auto'>
                    Student HomePage
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default StudentHomePage