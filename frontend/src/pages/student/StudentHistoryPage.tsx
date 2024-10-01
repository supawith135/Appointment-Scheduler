import StudentHistoryTable from '../../components/student/StudentHistoryTable';
import FrontLayout from '../../components/layouts/FrontLayout'
function StudentHistoryPage() {
  return (
    <FrontLayout>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white ">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-red-700 mb-6 lg:mb-10 text-center">
            ประวัติการจองคิวหมายของนักศึกษา
          </h1>
        </div>
        <div className='m-auto w-full sm:w-full lg:w-4/5'>
        <StudentHistoryTable />          
        </div>
      </main>
    </FrontLayout>
  );
}

export default StudentHistoryPage;
