import CalendarTeacher from '../../components/teacher/CalendarTeacher'
import FrontLayout from '../../components/layouts/FrontLayout'
function TeacherAppointmentPage() {
    return (
        <FrontLayout>
            <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white ">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
                        การนัดหมายของอาจารย์
                    </h1>
                    <></>
                    <CalendarTeacher/>
                </div>
            </main>
        </FrontLayout>
    )
}

export default TeacherAppointmentPage