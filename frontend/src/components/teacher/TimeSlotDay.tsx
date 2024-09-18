// src/components/CalendarDay.tsx
interface CalendarDayProps {
    day: string;
    date: number;
    times: string[];
    onTimeSelect: (time: string) => void;
    currentDate: Date; // Prop to pass the current date
  }
  
  function TimeSlotDay({ day, date, times, onTimeSelect, currentDate }: CalendarDayProps) {
    // Check if the current day is today
    const isToday = currentDate.getDate() === date &&
                     currentDate.getMonth() === (new Date()).getMonth() &&
                     currentDate.getFullYear() === (new Date()).getFullYear();
  
    // Determine text and background color based on the conditions
    const textColor = isToday ? 'text-red-500' : 'text-gray-400';
    const backgroundColor = isToday ? 'bg-blue-500' : '';
  
    return (
      <div className="text-center">
        <p className={`text-sm ${textColor}`}>{day}</p>
        <p className={`text-2xl font-bold mb-2 ${backgroundColor} ${isToday ? 'text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''}`}>
          {date}
        </p>
        {times.map((time, index) => (
          <button
            key={index}
            className="block w-full bg-gray-200 hover:bg-blue-500 hover:text-white rounded-md py-1 px-3 mb-2 text-sm transition-colors duration-300 ease-in-out"
            onClick={() => onTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    );
  }
  
  export default TimeSlotDay;
  