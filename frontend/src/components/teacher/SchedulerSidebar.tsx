import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Alert } from '@mui/material';

interface TimeSlot {
    ID: number;
    slot_date: string;
    slot_start_time: string;
    slot_end_time: string;
    title: string;
}

function SchedulerSidebar() {
    const today = dayjs().format('YYYY-MM-DD');
    const [availability, setAvailability] = React.useState<Record<string, DateRange<Dayjs>[]>>({
        [today]: [[dayjs().startOf('day'), dayjs().endOf('day')]]
    });
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
    const [showCalendar, setShowCalendar] = React.useState(false);
    const [title, setTitle] = React.useState<string>('');
    const [duration, setDuration] = React.useState<string>('30 minutes');
    const [error, setError] = React.useState<string>('');

    const durationMinutes = parseInt(duration.split(' ')[0]);

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            const dateString = date.format('YYYY-MM-DD');
            setSelectedDate(date);
            setShowCalendar(false);
            if (!availability[dateString]) {
                setAvailability((prev) => ({
                    ...prev,
                    [dateString]: [[date.startOf('day'), date.endOf('day')]],
                }));
            }
        }
    };

    const isTimeRangeValid = (start: Dayjs | null, end: Dayjs | null): boolean => {
        if (!start || !end) return true;
        const startMinutes = start.minute();
        const endMinutes = end.minute();
        const durationSlots = 60 / durationMinutes;

        return (
            startMinutes % durationMinutes === 0 &&
            endMinutes % durationMinutes === 0 &&
            end.diff(start, 'minute') % durationMinutes === 0
        );
    };

    const isTimeOverlapping = (day: string, index: number, newRange: DateRange<Dayjs>): boolean => {
        return availability[day].some((range, i) => {
            if (i === index) return false;
            const [existingStart, existingEnd] = range;
            const [newStart, newEnd] = newRange;
            return (
                (newStart?.isBefore(existingEnd) && newEnd?.isAfter(existingStart))
            );
        });
    };

    const handleTimeChange = (day: string, index: number, type: 'start' | 'end', newValue: Dayjs | null) => {
        setAvailability((prev) => {
            const newRanges = [...prev[day]];
            newRanges[index] = type === 'start' ? [newValue, newRanges[index][1]] : [newRanges[index][0], newValue];

            if (!isTimeRangeValid(newRanges[index][0], newRanges[index][1])) {
                setError(`Selected time range does not match the ${duration} interval.`);
            } else if (isTimeOverlapping(day, index, newRanges[index])) {
                setError("This time range overlaps with another range on the same day.");
            } else {
                setError('');
            }

            return {
                ...prev,
                [day]: newRanges,
            };
        });
    };

    const addTimeRange = (day: string) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: [...prev[day], [dayjs().startOf('day'), dayjs().endOf('day')]],
        }));
    };

    const removeTimeRange = (day: string, index: number) => {
        setAvailability((prev) => {
            const newRanges = prev[day].filter((_, i) => i !== index);
            const newAvailability = { ...prev, [day]: newRanges };
            if (newRanges.length === 0) {
                delete newAvailability[day];
            }
            return newAvailability;
        });
    };

    const handleAddDateClick = () => {
        setShowCalendar(true);
        setSelectedDate(null);
    };

    const generateTimeSlots = (date: string, startTime: Dayjs, endTime: Dayjs, title: string, durationMinutes: number): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        let currentStartTime = startTime;
        let id = 1;

        while (currentStartTime.isBefore(endTime)) {
            const slotEndTime = currentStartTime.add(durationMinutes, 'minute');
            if (slotEndTime.isAfter(endTime)) break;

            slots.push({
                ID: id,
                slot_date: `${date}T00:00:00Z`,
                slot_start_time: currentStartTime.format('YYYY-MM-DDTHH:mm:00Z'),
                slot_end_time: slotEndTime.format('YYYY-MM-DDTHH:mm:00Z'),
                title: title,
            });

            currentStartTime = slotEndTime;
            id++;
        }

        return slots;
    };

    const handleConfirm = () => {
        const allTimeSlots: TimeSlot[] = [];

        Object.entries(availability).forEach(([day, ranges]) => {
            ranges.forEach(([start, end]) => {
                if (start && end) {
                    const slots = generateTimeSlots(day, start, end, title, durationMinutes);
                    allTimeSlots.push(...slots);
                }
            });
        });

        console.log('Generated Time Slots:');
        allTimeSlots.forEach(slot => console.log(JSON.stringify(slot, null, 2)));
    };

    return (
        <div className="w-full max-w-md bg-white p-6 shadow-md overflow-y-auto h-screen">
            <h2 className="text-xl font-bold mb-4">BOOKABLE APPOINTMENT SCHEDULE</h2>
            <input
                type="text"
                placeholder="Add title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-b-2 border-gray-400 focus:outline-none mb-4 bg-white p-3 focus:border-ENGi-Red"
            />
            <div className="mb-4">
                <h3 className="font-semibold">Appointment duration</h3>
                <p className="text-sm text-gray-600">How long should each appointment last?</p>
                <select
                    className="w-full border rounded p-2 mt-2 bg-white"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                >
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>1 hour</option>
                </select>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">General availability</h3>
                <p className="text-sm text-gray-600">Set your available time slots for appointments.</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {Object.keys(availability).map((day) => (
                        <div key={day} className="mt-4">
                            <div className="flex flex-col">
                                <h4 className="text-md font-medium mb-2 items-center">{day}</h4>
                                {availability[day].map((range, index) => (
                                    <div key={index} className="flex mb-2">
                                        <div className="flex-grow max-w-[150px]">
                                            <TimePicker
                                                label="From"
                                                value={range[0]}
                                                onChange={(newValue) => handleTimeChange(day, index, 'start', newValue)}
                                            />
                                        </div>
                                    
                                        <div className="flex-grow max-w-[150px]">
                                            <TimePicker
                                                label="To"
                                                value={range[1]}
                                                onChange={(newValue) => handleTimeChange(day, index, 'end', newValue)}
                                            />
                                        </div>
                                        <div className='items-center ml-3 flex justify-center'>
                                            <MdOutlineAddCircleOutline
                                                className="fill-blue-500 ml-4 cursor-pointer size-5"
                                                onClick={() => addTimeRange(day)} />
                                            <FaRegTrashAlt
                                                onClick={() => removeTimeRange(day, index)}
                                                className="fill-red-500 ml-4 cursor-pointer size-5"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {!showCalendar && (
                        <button
                            onClick={handleAddDateClick}
                            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                        >
                            + เพิ่มวันที่
                        </button>
                    )}
                    {showCalendar && (
                        <DateCalendar value={selectedDate} onChange={handleDateChange} />
                    )}
                </LocalizationProvider>
            </div> 
            {error && <Alert severity="error">{error}</Alert>}
            <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                ยืนยัน
            </button>
        </div>
    );
}

export default SchedulerSidebar;