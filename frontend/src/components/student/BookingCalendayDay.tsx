import React from 'react';

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

interface CalendarDayProps {
  day: string;
  date: number;
  slots: BookingSlot[];
  onTimeSelect: (slot: BookingSlot) => void;
  currentDate: Date;
}

const BookingCalendayDay: React.FC<CalendarDayProps> = ({ day, date, slots, onTimeSelect, currentDate }) => {
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
        slots.map((slot) => (
          slot.is_available ? (
            <button
              key={slot.time_slot_id}
              className={`block w-full bg-gray-200 hover:bg-blue-500 hover:text-white rounded-md py-1 px-3 mb-2 text-sm transition-colors duration-300 ease-in-out`}
              onClick={() => onTimeSelect(slot)}
            >
              {new Date(slot.slot_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
          ) : (
            <button
              key={slot.time_slot_id}
              className={`block w-full bg-red-200 cursor-not-allowed rounded-md py-1 px-3 mb-2 text-sm transition-colors duration-300 ease-in-out`}
              disabled
            >
              {/* Slot time not displayed */}
              No time available
            </button>
          )
        ))
      ) : (
        <p className="text-sm text-gray-500">No available slots</p>
      )}
    </div>
  );
}

export default BookingCalendayDay;
