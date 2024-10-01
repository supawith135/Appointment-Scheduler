import StudentListTable from '../../components/admin/StudentListTable'
import FrontLayout from '../../components/layouts/FrontLayout'
function StudentListPage() {
  return (
    <FrontLayout>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-red-700 mb-6 lg:mb-10 text-center">
            รายชื่อนักศึกษา
          </h1>
          <StudentListTable />
        </div>
      </main>
    </FrontLayout>
  )
}

export default StudentListPage