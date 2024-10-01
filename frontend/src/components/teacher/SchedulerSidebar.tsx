import React from 'react';
import 'dayjs/locale/th';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import TextField from '@mui/material/TextField';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { CreateTimeSlot } from '../../services/https/teacher/timeSlot';

import { TimeSlotsInterface } from '../../interfaces/ITimeSlots';

const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
});

function SchedulerSidebar() {
    const today = dayjs().format('YYYY-MM-DD');
    const [availability, setAvailability] = React.useState<Record<string, DateRange<Dayjs>[]>>({
        [today]: [[dayjs().startOf('day'), dayjs().endOf('day')]]
    });
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
    const [showCalendar, setShowCalendar] = React.useState(false);
    const [title, setTitle] = React.useState<string>('');
    const [location, setLocation] = React.useState<string>('');
    const [duration, setDuration] = React.useState<string>('15 นาที');
    const [error, setError] = React.useState<string>('');
    const [errorTitle, setErrorTitle] = React.useState<string | null>(null);
    const [errorLocation, setErrorLocation] = React.useState<string | null>(null);
    // const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const durationMinutes = parseInt(duration.split(' ')[0]);

    dayjs.locale('th'); // Set the locale to Thai

    // const formatTimeToThai = (time: Dayjs | null) => {
    //     if (!time) return '';
    //     return time.toDate().toLocaleTimeString('th-TH', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //     });
    // };

    const formatDateToThai = (date: Dayjs) => {
        return date.format('D MMMM YYYY');
    };

    // ฟังก์ชันสำหรับการตรวจสอบวันที่
    const shouldDisableDate = (date: Dayjs) => {
        return date.isBefore(dayjs().startOf('day'));
    };
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

    const isFormValid = () => {
        return title && location && Object.keys(availability).length > 0 && !error;
    };

    const isTimeRangeValid = (start: Dayjs | null, end: Dayjs | null): boolean => {
        if (!start || !end) return true;
        const startMinutes = start.minute();
        const endMinutes = end.minute();

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
            const currentRange = newRanges[index];
            let updatedRange: DateRange<Dayjs>;

            if (type === 'start') {
                updatedRange = [newValue, currentRange[1]];
            } else {
                updatedRange = [currentRange[0], newValue];
            }

            // Check if both start and end times are set
            if (updatedRange[0] && updatedRange[1]) {
                // Check if start time is the same as end time
                if (updatedRange[0].isSame(updatedRange[1])) {
                    setError("เวลาเริ่มต้นต้องมาก่อนเวลาสิ้นสุด");
                    return prev; // Return the previous state without updating
                }
                // Check if start time is after end time
                if (updatedRange[0].isAfter(updatedRange[1])) {
                    setError("เวลาเริ่มต้นต้องมาก่อนเวลาสิ้นสุด");
                    return prev; // Return the previous state without updating
                }
            }

            if (!isTimeRangeValid(updatedRange[0], updatedRange[1])) {
                setError(`ช่วงเวลาที่เลือกไม่สอดคล้องกับช่วงเวลา ${duration}`);
            } else if (isTimeOverlapping(day, index, updatedRange)) {
                setError("ช่วงเวลานี้ซ้ำซ้อนกับช่วงเวลาอื่นในวันเดียวกัน");
            } else {
                setError('');
            }

            newRanges[index] = updatedRange;

            return {
                ...prev,
                [day]: newRanges,
            };
        });
    };

    const addTimeRange = (day: string) => {
        setAvailability((prev) => {
            const newRanges = [...prev[day]];
            const lastRange = newRanges[newRanges.length - 1];

            if (lastRange && lastRange[1]) { // ตรวจสอบว่า lastRange และ lastRange[1] ไม่เป็น null
                const newStart = lastRange[1]; // เริ่มจากเวลาสิ้นสุดของช่วงเวลาสุดท้าย
                const newEnd = newStart.add(durationMinutes, 'minute'); // เพิ่มระยะเวลา (duration) ต่อไป

                if (newStart.isBefore(dayjs().endOf('day'))) {
                    // เพิ่มช่วงเวลาใหม่ถ้า newStart ยังไม่ถึงสิ้นวัน
                    newRanges.push([newStart, newEnd]);
                }
            }

            return {
                ...prev,
                [day]: newRanges,
            };
        });
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

    const generateTimeSlots = (date: string, startTime: Dayjs, endTime: Dayjs, title: string, location: string, durationMinutes: number, userId: number): TimeSlotsInterface[] => {
        const slots: TimeSlotsInterface[] = [];
        let currentStartTime = startTime;

        while (currentStartTime.isBefore(endTime)) {
            const slotEndTime = currentStartTime.add(durationMinutes, 'minute');
            if (slotEndTime.isAfter(endTime)) break;

            slots.push({
                user_id: userId,
                slot_date: new Date(`${date}T00:00:00+07:00`), // Convert to Date
                slot_start_time: new Date(currentStartTime.format('YYYY-MM-DDTHH:mm:ss[+07:00]')), // Convert to Date
                slot_end_time: new Date(slotEndTime.format('YYYY-MM-DDTHH:mm:ss[+07:00]')), // Convert to Date
                title: title,
                location: location,
                is_available: true,
            });

            currentStartTime = slotEndTime;
        }
        return slots;
    };

    const getDisabledTimes = (day: string, index: number): Dayjs[] => {
        const disabledTimes: Dayjs[] = [];

        // เก็บเวลาที่เลือกในวันนั้น
        const selectedRanges = availability[day].filter((_, i) => i !== index);

        // เพิ่มช่วงเวลาที่เลือกทั้งหมดในวันนั้นเข้าไป
        selectedRanges.forEach((range) => {
            const [start, end] = range;

            if (start && end) {
                let current = start.clone();
                while (current.isBefore(end)) {
                    disabledTimes.push(current);
                    current = current.add(15, 'minute'); // เพิ่มช่วงเวลา (15 นาที)
                }
            }
        });

        // เพิ่มเวลาทั้งหมดก่อนเวลาเริ่มต้นของช่วงเวลาที่เลือก
        const currentRange = availability[day][index];
        if (currentRange) {
            const [start] = currentRange;
            if (start) {
                let current = dayjs().startOf('day'); // เริ่มจากเวลา 00:00
                while (current.isBefore(start)) {
                    disabledTimes.push(current);
                    current = current.add(15, 'minute'); // เพิ่มช่วงเวลา (15 นาที)
                }
            }
        }

        // เพิ่ม 00:00 ให้เลือกได้
        disabledTimes.push(dayjs().startOf('day')); // สามารถเลือก 00:00 ได้เสมอ

        return disabledTimes;
    };


    const handleConfirm = async () => {
        let hasError = false;

        if (!title) {
            setErrorTitle('กรุณากรอกหัวข้อการนัดหมาย');
            hasError = true;
        } else {
            setErrorTitle(null);
        }

        if (!location) {
            setErrorLocation('กรุณากรอกที่อยู่');
            hasError = true;
        } else {
            setErrorLocation(null);
        }

        if (hasError) {
            return;
        }

        const userId = parseInt(localStorage.getItem("id") || "0", 10);
        if (userId === 0) {
            setErrorMessage("ไม่พบ ID ผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
            return;
        }

        const allTimeSlots: TimeSlotsInterface[] = [];

        Object.entries(availability).forEach(([day, ranges]) => {
            ranges.forEach(([start, end]) => {
                if (start && end) {
                    const slots = generateTimeSlots(day, start, end, title, location, durationMinutes, userId);
                    allTimeSlots.push(...slots);
                }
            });
        });

        if (allTimeSlots.length === 0) {
            setErrorMessage("ส่งข้อมูลไม่สำเร็จ กรุณาน่า สร้างข้อมูลใหม่อีกครั้ง");
            return;
        }

        console.log('All time slots to be created:', JSON.stringify(allTimeSlots, null, 2));

        setIsLoading(true);

        try {
            for (const slot of allTimeSlots) {
                const res = await CreateTimeSlot(slot);
                if (res.status !== 201) {
                    throw new Error(`Failed to create time slot: ${res.data.message}`);
                }
            }
            

            setSnackbarOpen(true);
            setTitle('');
            setLocation('');
            setAvailability({});
            setSelectedDate(null);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการสร้างช่วงเวลา");
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };

    // Effect to trigger the message
    React.useEffect(() => {
        if (errorMessage) {
            // messageApi.open({
            //     type: errorMessage === "สร้างช่วงเวลาทั้งหมดสำเร็จ" ? "success" : "error",
            //     content: errorMessage,
            // });
            setErrorMessage(null); // Reset the error message
        }
    }, [errorMessage]);

    return (
        <ThemeProvider theme={theme}>
            <div className="w-full max-w-md bg-white p-6 shadow-md overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-ENGi-Red ">สร้างเวลานัดหมาย</h2>
                <Box >
                    <TextField
                        id="title"
                        label="หัวข้อการนัดหมาย"
                        placeholder="เพิ่มข้อหัวการนัดหมาย"
                        fullWidth
                        multiline
                        variant="standard"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!errorTitle}
                        helperText={errorTitle}
                    />
                    <TextField
                        id="location"
                        label="ที่อยู่"
                        placeholder="ที่อยู่"
                        fullWidth
                        multiline
                        variant="standard"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{ marginTop: 2 }}
                        error={!!errorLocation}
                        helperText={errorLocation}
                    />

                </Box>
                <Box sx={{ minWidth: 120, marginTop: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            ระยะเวลาการนัดหมาย
                        </InputLabel>
                        <NativeSelect
                            inputProps={{
                                name: 'range time',
                                id: 'uncontrolled-native',
                            }}
                            value={duration} // ใช้ value แทน defaultValue
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option value="15 นาที">15 นาที</option>
                            <option value="30 นาที">30 นาที</option>
                            <option value="45 นาที">45 นาที</option>
                            <option value="60 นาที">60 นาที</option>
                        </NativeSelect>
                    </FormControl>
                </Box>
                <div >
                    <h3 className="font-semibold mt-4">เวลาว่างทั่วไป</h3>
                    <p className="text-sm text-gray-600">กำหนดเวลาที่คุณมักจะว่างสำหรับการนัดหมาย</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                        {Object.keys(availability).map((day) => (
                            <div key={day} className="mt-4">
                                <div className="flex flex-col">
                                    <h4 className="text-md font-medium mb-2 items-center">{formatDateToThai(dayjs(day))}</h4>
                                    {availability[day].map((range, index) => (
                                        <div key={index} className="flex mb-2 items-center flex-row gap-4">
                                            <div className="flex-grow max-w-[180px]">
                                                <TimePicker
                                                    label="From"
                                                    value={range[0]}
                                                    onChange={(newValue) => handleTimeChange(day, index, 'start', newValue)}
                                                    shouldDisableTime={(time) => getDisabledTimes(day, index).some(disabledTime => disabledTime.isSame(time, 'minute'))}

                                                />
                                            </div>
                                            -
                                            <div className="flex-grow max-w-[180px]">
                                                <TimePicker
                                                    label="To"
                                                    value={range[1]}
                                                    onChange={(newValue) => handleTimeChange(day, index, 'end', newValue)}
                                                    shouldDisableTime={(time) => getDisabledTimes(day, index).some(disabledTime => disabledTime.isSame(time, 'minute'))}

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
                                    {error && <Alert severity="error">{error}</Alert>}
                                </div>
                            </div>
                        ))}

                        {!showCalendar && (
                            <button
                                onClick={handleAddDateClick}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-2"
                            >
                                + เพิ่มวันที่
                            </button>
                        )}
                        {showCalendar && (
                            <DateCalendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                shouldDisableDate={shouldDisableDate} // ใช้ฟังก์ชันที่สร้างขึ้น
                            />
                        )}
                    </LocalizationProvider>
                </div>

                <button
                    onClick={handleConfirm}
                    className={`text-white font-bold py-2 px-4 mt-2 rounded ${isFormValid() ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? 'กำลังสร้าง...' : 'ยืนยัน'}
                </button>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                    <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                        สร้างช่วงเวลาทั้งหมดสำเร็จ
                    </Alert>
                </Snackbar>
            </div>
        </ThemeProvider>
    );
}

export default SchedulerSidebar;