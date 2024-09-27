import FrontLayout from '../../components/layouts/FrontLayout';
import TeacherDetail from '../../components/shared/TeacherDetail'
function AdminTeacherDetailPage() {
  return (
    <FrontLayout>
      <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
            รายละเอียดอาจารย์
          </h1>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
        <TeacherDetail />
      </main>
    </FrontLayout>

  )
}

export default AdminTeacherDetailPage