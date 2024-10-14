import FrontLayout from '../../components/layouts/FrontLayout';
import StudentNote from '../../components/teacher/StudentNote';
function TeacherStudentNotePage() {
  return (
    <FrontLayout>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white ">
        <StudentNote/>
      </main>
    </FrontLayout>
  );
}

export default TeacherStudentNotePage;
