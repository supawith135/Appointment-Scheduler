import Header from '../../layout/Header'
import StudentNavbar from '../../layout/StudentNavbar'
import Footer from '../../layout/Footer'
import StudentHistoryTable from '../../component/student/StudentHistoryTable'

function StudentHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <StudentNavbar />
            <div className='flex flex-grow m-auto'>
                <div className='text-2xl m-auto'>
                    <StudentHistoryTable />
                </div>
            </div>
            <Footer />
        </div>
  )
}

export default StudentHistoryPage