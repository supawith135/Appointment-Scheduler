import Header from '../../layout/Header';
import TeacherNavbar from '../../layout/TeacherNavbar';
import Footer from '../../layout/Footer';
import SchedulerSidebar from '../../component/teacher/SchedulerSidebar';
import TimeSlot from '../../component/teacher/TimeSlot';
import { useState } from 'react';

function TeacherCreateTimeSlotPage() {
  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<string>('1 hour');
  const [availability, setAvailability] = useState<{ [key: string]: string }>({
    Sun: 'Unavailable',
    Mon: '09:00 - 17:00',
    Tue: '09:00 - 17:00',
    Wed: '09:00 - 17:00',
    Thu: '09:00 - 17:00',
    Fri: '09:00 - 17:00',
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <TeacherNavbar />
      <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white font-NotoSans">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="lg:w-1/3 w-full">
            <SchedulerSidebar />
          </div>
          <div className="lg:w-2/3 w-full mt-6 lg:mt-0">
            <TimeSlot />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TeacherCreateTimeSlotPage;
