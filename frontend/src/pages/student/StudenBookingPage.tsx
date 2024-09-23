import BookingCalendar from '../../components/student/BookingCalendar'
import FrontLayout from '../../components/layouts/FrontLayout'
function StudentAppointmentPage() {
  return (
    <FrontLayout>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 items-center bg-white ">
        <div className="max-w-4xl mx-auto">
          {/* <h1 className="text-2xl md:text-3xl  text-center mb-6 text-red-700">
            Student Appointment Page
          </h1> */}
          <div className='flex justify-center'>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-red-700 mb-6 lg:mb-10 text-center">
              เลือกเวลาจองคิวนัดหมาย
            </p>
          </div>
          <BookingCalendar />
        </div>
      </main>
    </FrontLayout>
  )
}

export default StudentAppointmentPage
