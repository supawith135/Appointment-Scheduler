import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';

function SchedulerSidebar() {
    const today = dayjs().format('YYYY-MM-DD');
    const [availability, setAvailability] = React.useState<Record<string, DateRange<Dayjs>[]>>({
        [today]: [[dayjs().startOf('day'), dayjs().endOf('day')]]
    });
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
    const [showCalendar, setShowCalendar] = React.useState(false);

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

    const handleTimeRangeChange = (day: string, index: number, newValue: DateRange<Dayjs>) => {
        setAvailability((prev) => {
            const newRanges = [...prev[day]];
            newRanges[index] = newValue;
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

    return (
        <div className="w-full max-w-md bg-white p-6 shadow-md overflow-y-auto h-screen">
            <h2 className="text-xl font-bold mb-4">BOOKABLE APPOINTMENT SCHEDULE</h2>
            <input
                type="text"
                placeholder="Add title"
                className="w-full border-b-2 border-gray-400 focus:outline-none mb-4 bg-white p-3 focus:border-orange-500"
            />
            <div className="mb-4">
                <h3 className="font-semibold">Appointment duration</h3>
                <p className="text-sm text-gray-600">How long should each appointment last?</p>
                <select className="w-full border rounded p-2 mt-2 bg-white">
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
                                        <div className="flex-grow max-w-[300px]">
                                            <MultiInputTimeRangeField
                                                value={range}
                                                onChange={(newValue) => handleTimeRangeChange(day, index, newValue)}
                                                slotProps={{
                                                    textField: ({ position }) => ({
                                                        label: position === 'start' ? 'From' : 'To',
                                                    }),
                                                }}
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    );
}

export default SchedulerSidebar;
