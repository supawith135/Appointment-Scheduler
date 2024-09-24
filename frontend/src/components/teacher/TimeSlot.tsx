// // src/components/Calendar.tsx
// import React, { useState, useEffect } from 'react';

// import ModalTime from '../modal/BookingModalTime';
// import TimeSlotDay from './TimeSlotDay';
// interface DayInfo {
//   day: string;
//   date: number;
//   times: string[];
//   isSelected?: boolean;
// }

// function TimeSlot() {
//   const [currentDate, setCurrentDate] = useState<Date>(new Date());
//   const [days, setDays] = useState<DayInfo[]>([]);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [showModal, setShowModal] = useState<boolean>(false); // New state for showing modal after delay
//   const [selectedDay, setSelectedDay] = useState<string | null>(null);
//   const [selectedReason, setSelectedReason] = useState<string | null>(null);

//   useEffect(() => {
//     generateWeekDays(currentDate);
//   }, [currentDate]);

//   useEffect(() => {
//     if (isModalOpen) {
//       const timer = setTimeout(() => setShowModal(true), 500); // Delay of 0.5 seconds
//       return () => clearTimeout(timer);
//     } else {
//       setShowModal(false); // Immediately hide modal when closing
//     }
//   }, [isModalOpen]);

//   const generateWeekDays = (date: Date) => {
//     const startOfWeek = new Date(date);
//     startOfWeek.setDate(date.getDate() - date.getDay());

//     const weekDays: DayInfo[] = [];
//     for (let i = 0; i < 7; i++) {
//       const day = new Date(startOfWeek);
//       day.setDate(startOfWeek.getDate() + i);
//       weekDays.push({
//         day: day.toLocaleString('default', { weekday: 'short' }).toUpperCase(),
//         date: day.getDate(),
//         times: generateRandomTimes(),
//         isSelected: i === 0,
//       });
//     }
//     setDays(weekDays);
//   };

//   const generateRandomTimes = () => {
//     const times = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];
//     return times.filter(() => Math.random() > 0.5); // Might result in an empty array
//   };

//   const navigateDate = (direction: 'prev' | 'next') => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
//     setCurrentDate(newDate);
//   };

//   const handleTimeSelection = (day: string, time: string) => {
//     setSelectedDay(day);
//     setSelectedTime(`${day} ${time}`);
//     setIsModalOpen(true); // Trigger modal open
//   };

//   const handleModalSubmit = (reason: string) => {
//     setSelectedReason(reason);
//     setIsModalOpen(false); // Close modal
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-6 sm:mb-10">
//         <button
//           onClick={() => navigateDate('prev')}
//           className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 hover:text-white"
//         >
//           &lt;
//         </button>
//         <div className="flex items-center">
//           <p className="text-base sm:text-xl font-semibold text-black text-center">
//             {currentDate.toLocaleDateString('default', {
//               year: 'numeric',
//               month: 'long',
//             })}
//           </p>
//         </div>
//         <button
//           onClick={() => navigateDate('next')}
//           className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 hover:text-white"
//         >
//           &gt;
//         </button>
//       </div>
//       <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
//         {days.map(day => (
//           <TimeSlotDay
//             key={`${day.day}-${day.date}`}
//             {...day}
//             currentDate={currentDate} // Pass currentDate to CalendarDay
//             onTimeSelect={(time: string) => handleTimeSelection(day.day, time)}
//           />
//         ))}
//       </div>
//       {selectedTime && (
//         <p className="mt-4 text-center text-sm sm:text-lg font-semibold">
//           Selected time: {selectedTime}
//         </p>
//       )}
//       <ModalTime
//         isOpen={showModal}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleModalSubmit}
      
//         selectedTime={selectedTime}
//       />
//       {selectedReason && (
//         <p className="mt-4 text-center text-sm sm:text-lg font-semibold">
//           Submitted reason: {selectedReason}
//         </p>
//       )}
//     </div>
//   );
// }

// export default TimeSlot;
