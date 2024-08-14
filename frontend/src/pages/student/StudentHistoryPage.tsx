import Header from '../../layout/Header';

import Footer from '../../layout/Footer';
import StudentHistoryTable from '../../component/student/StudentHistoryTable';
import StudentNavbar from '../../layout/StudentNavbar';

function StudentHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <StudentNavbar/>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-Kanit text-center mb-6 text-orange-400">
            ประวัติการจองคิวหมายของนักศึกษา
          </h1>
          <StudentHistoryTable />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default StudentHistoryPage;
