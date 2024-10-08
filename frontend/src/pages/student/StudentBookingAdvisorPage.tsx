import BookingAdvisorCalendar from '../../components/student/BookingAdvisorCalendar'
import FrontLayout from '../../components/layouts/FrontLayout'
import AdvisorDetail from '../../components/student/AdvisorDetail'
function StudentBookingAdvisorPage() {
  return (
    <FrontLayout>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 items-center bg-white ">
        <div className="max-w-4xl mx-auto">

          <div className='flex justify-center'>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-red-700 mb-6 lg:mb-10 text-center">
              เลือกเวลาจองคิวนัดหมายอาจารที่ปรึกษา
            </p>
          </div>
          <AdvisorDetail/>
          <BookingAdvisorCalendar />
        </div>
      </main>
    </FrontLayout>
  )
}

export default StudentBookingAdvisorPage
