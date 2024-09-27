import SchedulerSidebar from '../../components/teacher/SchedulerSidebar';
import FrontLayout from '../../components/layouts/FrontLayout';
// import AppointmentScheduler from '../../components/teacher/AppointmentScheduler';
import TimeSlot from '../../components/teacher/TimeSlot';
function TeacherCreateTimeSlotPage() {
  return (
    <FrontLayout>
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white ">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="lg:w-1/3 w-full">
            <SchedulerSidebar />
          </div>
          {/* <div className="lg:w-2/3 w-full mt-6 lg:mt-0"> */}
            {/* <CreateTimeSlot /> */}
          {/* </div> */}
          <div>
            {/* <AppointmentScheduler/> */}
          </div>
          <div>
            <TimeSlot/>
          </div>
        </div>
      </main>
    </FrontLayout>
  );
}

export default TeacherCreateTimeSlotPage;
