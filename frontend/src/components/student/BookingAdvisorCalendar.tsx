import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { message } from "antd";
import { GetListBookingAdvisor } from '../../services/https/student/booking';
import { TimeSlotsInterface } from '../../interfaces/ITimeSlots';
import BookingTimeAdvisorModal from '../modal/BookingTimeAdvisorModal';
interface DayInfo {
  day: string;
  date: number;
  slots: TimeSlotsInterface[];
  isSelected?: boolean;
}

interface CalendarDayProps {
  day: string;
  date: number;
  slots: TimeSlotsInterface[];
  onTimeSelect: (slot: TimeSlotsInterface) => void;
  currentDate: Date;
  className?: string;
}

function BookingCalendayDay({ day, date, slots, onTimeSelect, currentDate }: CalendarDayProps) {
  const today = new Date();
  const isToday = date === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const textColor = isToday ? 'text-red-500' : 'text-gray-400';
  const backgroundColor = isToday ? 'bg-blue-500' : '';

  return (
    <motion.div 
      className="text-center p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className={`text-sm ${textColor}`}>{day}</p>
      <motion.p 
        className={`text-2xl font-bold mb-2 ${backgroundColor} ${isToday ? 'text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''}`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {date}
      </motion.p>
      {slots.length > 0 ? (
        slots.map((slot) => {
          const startTime = new Date(slot.slot_start_time!);
          const formattedTime = startTime.toLocaleTimeString('th-TH', {
            hour: 'numeric',
            minute: 'numeric',
          }) + ' น.';

          return (
            <motion.button
              key={slot.ID}
              className={`block w-full ${slot.is_available ? 'bg-gray-200 hover:bg-blue-500 hover:text-white' : 'bg-red-200 cursor-not-allowed'} rounded-md py-1 px-3 mb-2 text-sm transition-colors duration-300 ease-in-out`}
              onClick={() => slot.is_available && onTimeSelect(slot)}
              disabled={!slot.is_available}
              whileHover={{ scale: slot.is_available ? 1.05 : 1 }}
              whileTap={{ scale: slot.is_available ? 0.95 : 1 }}
            >
              {formattedTime}
            </motion.button>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">ยังไม่มีช่วงเวลา</p>
      )}
    </motion.div>
  );
}

function BookingAdvisorCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [days, setDays] = useState<DayInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotsInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [bookingSlots, setBookingSlots] = useState<TimeSlotsInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [messageApi, contextHolder] = message.useMessage();
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDaysToShow = () => {
    if (screenSize < 640) return 2; // iPhone
    if (screenSize < 768) return 3; // iPad portrait
    if (screenSize < 1024) return 4; // iPad landscape
    return 7; // Larger screens
  };
  
  const getListBookingTeacherById = async (id: string) => {
    setIsLoading(true);
    try {
      let res = await GetListBookingAdvisor(id);
      if (res.status === 200) {
        setBookingSlots(res.data.data);
        console.log("res.data: ", res.data.data);
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลผู้ใช้",
        });
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const id = String(localStorage.getItem("id"))
  useEffect(() => {
    if (id) {
      getListBookingTeacherById(id);
    }
  }, [messageApi, id]);

  useEffect(() => {
    generateWeekDays(currentDate);
  }, [currentDate, bookingSlots]);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isModalOpen]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const numDays = getDaysToShow();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? numDays : -numDays));
    setCurrentDate(newDate);
  };

  const generateWeekDays = (date: Date) => {
    const weekDays: DayInfo[] = [];
    const numDays = getDaysToShow();

    for (let i = 0; i < numDays; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() + i);
      
      const daySlots = bookingSlots
        .filter(slot => new Date(slot.slot_date!).toDateString() === day.toDateString())
        .sort((a, b) => new Date(a.slot_start_time!).getTime() - new Date(b.slot_start_time!).getTime());

      weekDays.push({
        day: day.toLocaleString('default', { weekday: 'short' }).toUpperCase(),
        date: day.getDate(),
        slots: daySlots,
        isSelected: i === 0,
      });
    }
    setDays(weekDays);
  };

  const handleTimeSelection = (slot: TimeSlotsInterface) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (reason: string) => {
    setSelectedReason(reason);
    setIsModalOpen(false);
    // Here you might want to add logic to submit the booking to your backend
  };

  if (isLoading) {
    return <div className="text-center p-4">กำลังโหลดข้อมูล...</div>;
  }
  
  const thaiDayShortNames: { [key: string]: string } = {
    'วันอาทิตย์': 'อา.',
    'วันจันทร์': 'จ.',
    'วันอังคาร': 'อ.',
    'วันพุธ': 'พ.',
    'วันพฤหัสบดี': 'พฤ.',
    'วันศุกร์': 'ศ.',
    'วันเสาร์': 'ส.',
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {contextHolder}
      <motion.div 
        className="flex justify-between items-center mb-6 sm:mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigateDate('prev')}
          className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 hover:text-white transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          &lt;
        </motion.button>
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-base sm:text-xl font-semibold text-black text-center">
            {currentDate.toLocaleDateString('default', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </motion.div>
        <motion.button
          onClick={() => navigateDate('next')}
          className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 hover:text-white transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          &gt;
        </motion.button>
      </motion.div>
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
        initial={{ opacity: 0 , y : -20}}
        animate={{ opacity: 1 , y : 0}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {days.map(day => {
            const fullDayName = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date).toLocaleDateString('th-TH', { weekday: 'long' });
            const shortDayName = thaiDayShortNames[fullDayName as string] || fullDayName;

            return (
              <motion.div
                key={`${day.day}-${day.date}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <BookingCalendayDay
                  day={shortDayName}
                  date={day.date}
                  slots={day.slots}
                  currentDate={currentDate}
                  onTimeSelect={handleTimeSelection}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      {selectedSlot && (
        <motion.p 
          className="mt-4 text-center text-sm sm:text-lg font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Selected time: {new Date(selectedSlot.slot_start_time!).toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}, {new Date(selectedSlot.slot_start_time!).toLocaleTimeString('th-TH', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          })} น.
        </motion.p>
      )}
      <BookingTimeAdvisorModal
        isOpen={showModal}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        selectedTime={selectedSlot ? new Date(selectedSlot.slot_start_time!).toLocaleString() : null}
        slotDetails={selectedSlot}
      />
      {selectedReason && (
        <motion.p 
          className="mt-4 text-center text-sm sm:text-lg font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Submitted reason: {selectedReason}
        </motion.p>
      )}
    </div>
  );
}

export default BookingAdvisorCalendar;