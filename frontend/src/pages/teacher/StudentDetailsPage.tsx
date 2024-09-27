import FrontLayout from '../../components/layouts/FrontLayout'
import StudentDetail from '../../components/shared/StudentDetail'
import StudentBookingTable from '../../components/teacher/StudentBookingTable'
function StudentDetailsPage() {
    return (
        <FrontLayout>

            <div className="flex flex-grow flex-col  my-4 gap-3 ">
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
                        Student Details Page
                    </h1>
                </div>
              <StudentDetail/>
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <StudentBookingTable />
                </div>
            </div>
        </FrontLayout>
    )
}

export default StudentDetailsPage