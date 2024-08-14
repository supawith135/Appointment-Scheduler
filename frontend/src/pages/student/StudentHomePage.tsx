import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import StudentNavbar from '../../layout/StudentNavbar';

function StudentHomePage() {

    return (
        <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <StudentNavbar/>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
            Student HomePage
        </div>
      </main>
      <Footer />
    </div>
    )
}

export default StudentHomePage