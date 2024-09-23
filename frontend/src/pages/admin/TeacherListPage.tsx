import TeacherListTable from '../../components/admin/TeacherListTable'
import FrontLayout from '../../components/layouts/FrontLayout'
function TeacherListPage() {
  return (
    <FrontLayout>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
            รายชื่ออาจารย์
          </h1>
          <TeacherListTable />
        </div>
      </main>
    </FrontLayout>
  )
}

export default TeacherListPage