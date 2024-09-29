import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Checkbox, FormControlLabel, IconButton, Dialog } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.locale('th');
dayjs.extend(isBetween);

interface TimeSlot {
  startTime: Dayjs | null;
  endTime: Dayjs | null;
}

interface DaySlot {
  date: Dayjs;
  timeSlots: TimeSlot[];
}

interface AppointmentOptions {
  title: string;
  location: string;
  duration: 15 | 30 | 45 | 60;
  recurrence: 'none' | 'weekly' | 'biweekly';
  daySlots: DaySlot[];
  selectedDays: { [key: string]: TimeSlot[] };
}

const thaiDays: { [key: string]: string } = {
  Sunday: 'อาทิตย์',
  Monday: 'จันทร์',
  Tuesday: 'อังคาร',
  Wednesday: 'พุธ',
  Thursday: 'พฤหัสบดี',
  Friday: 'ศุกร์',
  Saturday: 'เสาร์',
};

export default function AppointmentScheduler() {
  const [appointment, setAppointment] = useState<AppointmentOptions>({
    title: '',
    location: '',
    duration: 30,
    recurrence: 'none',
    daySlots: [{ date: dayjs(), timeSlots: [{ startTime: null, endTime: null }] }],
    selectedDays: {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number | string>) => {
    const { name, value } = event.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDay = () => {
    setOpenCalendar(true);
  };

  const handleRemoveDay = (dayIndex: number) => {
    setAppointment(prev => ({
      ...prev,
      daySlots: prev.daySlots.filter((_, index) => index !== dayIndex),
    }));
  };

  const handleDateSelect = (newDate: Dayjs | null) => {
    if (newDate) {
      setAppointment(prev => ({
        ...prev,
        daySlots: [...prev.daySlots, { date: newDate, timeSlots: [{ startTime: null, endTime: null }] }],
      }));
      setOpenCalendar(false);
    }
  };

  const calculateEndTime = (startTime: Dayjs | null) => {
    if (startTime) {
      return startTime.add(appointment.duration, 'minute');
    }
    return null;
  };

  const handleAddTimeSlot = (dayIndex: number, day?: string) => {
    if (day) {
      setAppointment(prev => ({
        ...prev,
        selectedDays: {
          ...prev.selectedDays,
          [day]: [...prev.selectedDays[day], { startTime: null, endTime: null }],
        },
      }));
    } else {
      setAppointment(prev => ({
        ...prev,
        daySlots: prev.daySlots.map((daySlot, index) =>
          index === dayIndex
            ? { ...daySlot, timeSlots: [...daySlot.timeSlots, { startTime: null, endTime: null }] }
            : daySlot
        ),
      }));
    }
  };

  const handleRemoveTimeSlot = (dayIndex: number, timeIndex: number, day?: string) => {
    if (day) {
      setAppointment(prev => ({
        ...prev,
        selectedDays: {
          ...prev.selectedDays,
          [day]: prev.selectedDays[day].filter((_, i) => i !== timeIndex),
        },
      }));
    } else {
      setAppointment(prev => ({
        ...prev,
        daySlots: prev.daySlots.map((daySlot, dIndex) =>
          dIndex === dayIndex
            ? { ...daySlot, timeSlots: daySlot.timeSlots.filter((_, tIndex) => tIndex !== timeIndex) }
            : daySlot
        ),
      }));
    }
  };

  const handleTimeChange = (dayIndex: number, timeIndex: number, type: 'start' | 'end', newValue: Dayjs | null, day?: string) => {
    let updatedAppointment = { ...appointment };
    let slots: TimeSlot[];

    if (day) {
      slots = updatedAppointment.selectedDays[day];
    } else {
      slots = updatedAppointment.daySlots[dayIndex].timeSlots;
    }

    const updatedSlot = { ...slots[timeIndex], [type]: newValue };
    const otherTimeSlots = slots.filter((_, index) => index !== timeIndex);

    // Auto calculate end time based on the selected duration
    if (type === 'start') {
      updatedSlot.endTime = calculateEndTime(newValue);
    }

    slots[timeIndex] = updatedSlot;

    if (day) {
      updatedAppointment.selectedDays[day] = slots;
    } else {
      updatedAppointment.daySlots[dayIndex].timeSlots = slots;
    }

    setAppointment(updatedAppointment);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Appointment data:', appointment);
    // Transform and submit data here
  };

  const formatThaiDate = (date: Dayjs) => {
    return `${date.format('D MMMM YYYY')}`; // Remove day of the week
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          name="title"
          label="หัวข้อการนัดหมาย"
          value={appointment.title}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          name="location"
          label="สถานที่"
          value={appointment.location}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>ระยะเวลา</InputLabel>
          <Select
            name="duration"
            value={appointment.duration}
            onChange={handleSelectChange}
            required
          >
            <MenuItem value={15}>15 นาที</MenuItem>
            <MenuItem value={30}>30 นาที</MenuItem>
            <MenuItem value={45}>45 นาที</MenuItem>
            <MenuItem value={60}>60 นาที</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>การเกิดซ้ำ</InputLabel>
          <Select
            name="recurrence"
            value={appointment.recurrence}
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="none">ไม่เกิดซ้ำ</MenuItem>
            <MenuItem value="weekly">รายสัปดาห์</MenuItem>
            <MenuItem value="biweekly">ทุกสองสัปดาห์</MenuItem>
          </Select>
        </FormControl>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        {appointment.recurrence === 'none' && (
          <div>
            {appointment.daySlots.map((daySlot, dayIndex) => (
              <div key={dayIndex} className="mb-4">
                <h3>{formatThaiDate(daySlot.date)}</h3>
                {daySlot.timeSlots.map((slot, timeIndex) => (
                  <div key={timeIndex} className="flex items-center space-x-2 mb-2">
                    <TimePicker
                      label="เวลาเริ่มต้น"
                      value={slot.startTime}
                      onChange={(newValue) => handleTimeChange(dayIndex, timeIndex, 'start', newValue)}
                      ampm={false}
                      views={['hours', 'minutes']}
                      // inputFormat="HH:mm"
                      // renderInput={(params) => <TextField {...params} />}
                    />
                    <TimePicker
                      label="เวลาสิ้นสุด"
                      value={slot.endTime}
                      onChange={(newValue) => handleTimeChange(dayIndex, timeIndex, 'end', newValue)}
                      ampm={false}
                      views={['hours', 'minutes']}
                      // inputFormat="HH:mm"
                      // renderInput={(params) => <TextField {...params} />}
                    />
                    <IconButton onClick={() => handleRemoveTimeSlot(dayIndex, timeIndex)}>
                      <RemoveIcon />
                    </IconButton>
                  </div>
                ))}
                <Button onClick={() => handleAddTimeSlot(dayIndex)} startIcon={<AddIcon />}>
                  เพิ่มช่วงเวลา
                </Button>
                <Button onClick={() => handleRemoveDay(dayIndex)} color="secondary">
                  ลบวัน
                </Button>
              </div>
            ))}

            <Button onClick={handleAddDay} startIcon={<AddIcon />}>
              เพิ่มวัน
            </Button>
          </div>
        )}

        <Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
          <DateCalendar onChange={handleDateSelect} />
        </Dialog>

        <Button type="submit" variant="contained" color="primary">
          ยืนยันการนัดหมาย
        </Button>
      </form>
    </LocalizationProvider>
  );
}
