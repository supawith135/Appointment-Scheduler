import React, { useState } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Box,
} from '@mui/material';
import { CreateTimeSlot } from '../../services/https/teacher/timeSlot';
import { SelectChangeEvent } from '@mui/material/Select';

interface TimeSlotsInterface {
    ID?: number;
    user_id?: number;
    slot_date?: Date;
    slot_start_time?: Date;
    slot_end_time?: Date;
    location?: string;
    title?: string;
    is_available?: boolean;
}

const timeOptions = [15, 30, 45, 60]; // ระยะเวลาเป็นนาที

const TestAppointment: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [duration, setDuration] = useState<number>(15);
    const [slotDate, setSlotDate] = useState<Date>(new Date());
    const [slotStartTime, setSlotStartTime] = useState<Date>(new Date());
    const [slotEndTime, setSlotEndTime] = useState<Date>(new Date());

    const handleDurationChange = (event: SelectChangeEvent<number>) => {
        const selectedDuration = Number(event.target.value); // แปลงค่าเป็น number
        setDuration(selectedDuration);
        // คำนวณ slot_end_time จาก slot_start_time และ duration
        const endTime = new Date(slotStartTime);
        endTime.setMinutes(endTime.getMinutes() + selectedDuration);
        setSlotEndTime(endTime);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const id = Number(localStorage.getItem("id"))
        const newTimeSlot: TimeSlotsInterface = {
            user_id: id,
            title,
            location,
            slot_date: slotDate,
            slot_start_time: slotStartTime,
            slot_end_time: slotEndTime,
            is_available: true
        };

        try {
            const res = await CreateTimeSlot(newTimeSlot);
            if (res.status == 200) {
                console.log("data", res.data)
            }
        } catch (error) {

        }
        // เรียกใช้ฟังก์ชันสร้างเวลานัดหมาย (CreateTimeSlot)

        // เคลียร์ฟอร์มหลังจากส่ง
        setTitle('');
        setLocation('');
        setDuration(15);
        setSlotStartTime(new Date());
        setSlotEndTime(new Date());
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
                สร้างเวลานัดหมาย
            </Typography>
            <TextField
                label="ชื่อเรื่อง"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="สถานที่"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>ระยะเวลา (นาที)</InputLabel>
                <Select
                    value={duration}
                    onChange={handleDurationChange}
                >
                    {timeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option} นาที
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="วันที่"
                type="date"
                value={slotDate.toISOString().substring(0, 10)}
                onChange={(e) => setSlotDate(new Date(e.target.value))}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="เวลาเริ่ม"
                type="time"
                value={slotStartTime.toTimeString().substring(0, 5)}
                onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const startTime = new Date(slotDate);
                    startTime.setHours(parseInt(hours));
                    startTime.setMinutes(parseInt(minutes));
                    setSlotStartTime(startTime);
                    // คำนวณ slot_end_time จาก slot_start_time และ duration
                    const endTime = new Date(startTime);
                    endTime.setMinutes(endTime.getMinutes() + duration);
                    setSlotEndTime(endTime);
                }}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            
            <Typography>
                เวลาเริ่ม: {slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography>
                เวลาเสร็จสิ้น: {slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Button type="submit" variant="contained" color="primary">
                สร้างนัดหมาย
            </Button>
        </Box>
    );
};

export default TestAppointment;
