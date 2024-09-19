import React, { useState, useEffect } from 'react';
import ModalTime from '../modal/ModalTime';
import { message } from "antd";
import { GetListBookingAdvisor } from '../../services/https/student/booking';
import { useParams } from "react-router-dom";

interface BookingSlot {
  time_slot_id: number;
  slot_date: string;
  slot_start_time: string;
  slot_end_time: string;
  is_available: boolean;
  title: string;
  location: string;
  advisor_name: string;
}

interface DayInfo {
  day: string;
  date: number;
  slots: BookingSlot[];
  isSelected?: boolean;
}

interface CalendarDayProps {
  day: string;
  date: number;
  slots: BookingSlot[];
  onTimeSelect: (slot: BookingSlot) => void;
  currentDate: Date;
}

function BookingCalendayDay({ day, date, slots, onTimeSelect, currentDate }: CalendarDayProps) {
  const today = new Date();
  const isToday = date === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const textColor = isToday ? 'text-red-500' : 'text-gray-400';
  const backgroundColor = isToday ? 'bg-blue-500' : '';

  return (
    <div className="text-center">
      <p className={`text-sm ${textColor}`}>{day}</p>
      <p className={`text-2xl font-bold mb-2 ${backgroundColor} ${isToday ? 'text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''}`}>
        {date}
      </p>
      {slots.length > 0 ? (
        slots.map((slot) => {
          const startTime = new Date(slot.slot_start_time);
          const formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <button
              key={slot.time_slot_id}
              className={`block w-full ${slot.is_available ? 'bg-gray-200 hover:bg-blue-500 hover:text-white' : 'bg-red-200 cursor-not-allowed'} rounded-md py-1 px-3 mb-2 text-sm transition-colors duration-300 ease-in-out`}
              onClick={() => slot.is_available && onTimeSelect(slot)}
              disabled={!slot.is_available}
            >
              {formattedTime}
            </button>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">No available slots</p>
      )}
    </div>
  );
}

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [days, setDays] = useState<DayInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();

  const getListBookingAdvisor = async (id: string) => {
    setIsLoading(true);
    try {
      let res = await GetListBookingAdvisor(id);
      if (res.status === 200) {
        setBookingSlots(res.data.data);
        console.log("res.data: ",res.data.data);
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

  useEffect(() => {
    if (id) {
      getListBookingAdvisor(id);
    }
  }, [id, messageApi]);

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

  const generateWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const weekDays: DayInfo[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const daySlots = bookingSlots.filter(slot => 
        new Date(slot.slot_date).toDateString() === day.toDateString()
      );
      weekDays.push({
        day: day.toLocaleString('default', { weekday: 'short' }).toUpperCase(),
        date: day.getDate(),
        slots: daySlots,
        isSelected: i === 0,
      });
    }
    setDays(weekDays);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const handleTimeSelection = (slot: BookingSlot) => {
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

  return (
    <div className="p-4">
      {contextHolder}
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <button
          onClick={() => navigateDate('prev')}
          className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 hover:text-white"
        >
          &lt;
        </button>
        <div className="flex items-center">
          <p className="text-base sm:text-xl font-semibold text-black text-center">
            {currentDate.toLocaleDateString('default', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <button
          onClick={() => navigateDate('next')}
          className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 hover:text-white"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {days.map(day => (
          <BookingCalendayDay
            key={`${day.day}-${day.date}`}
            {...day}
            currentDate={currentDate}
            onTimeSelect={handleTimeSelection}
          />
        ))}
      </div>
      {selectedSlot && (
        <p className="mt-4 text-center text-sm sm:text-lg font-semibold">
          Selected time: {new Date(selectedSlot.slot_start_time).toLocaleString()}
        </p>
      )}
      <ModalTime
        isOpen={showModal}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        selectedTime={selectedSlot ? new Date(selectedSlot.slot_start_time).toLocaleString() : null}
      />
      {selectedReason && (
        <p className="mt-4 text-center text-sm sm:text-lg font-semibold">
          Submitted reason: {selectedReason}
        </p>
      )}
    </div>
  );
}

export default BookingCalendar;
