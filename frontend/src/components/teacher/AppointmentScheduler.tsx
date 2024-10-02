import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Checkbox, FormControlLabel } from '@mui/material';
import { Dayjs } from 'dayjs';

interface AppointmentOptions {
  title: string;
  location: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  duration: 15 | 30 | 45 | 60;
  recurrence: 'none' | 'weekly' | 'biweekly'; // Added biweekly option
  selectedDays: { [key: string]: { selected: boolean; startTime: Dayjs | null; endTime: Dayjs | null } }; 
}

export default function AppointmentScheduler() {
  const [status, setStatus] = useState<boolean>(true);
  const [appointment, setAppointment] = useState<AppointmentOptions>({
    title: '',
    location: '',
    startTime: null,
    endTime: null,
    duration: 30,
    recurrence: 'none',
    selectedDays: {
      Sunday: { selected: false, startTime: null, endTime: null },
      Monday: { selected: false, startTime: null, endTime: null },
      Tuesday: { selected: false, startTime: null, endTime: null },
      Wednesday: { selected: false, startTime: null, endTime: null },
      Thursday: { selected: false, startTime: null, endTime: null },
      Friday: { selected: false, startTime: null, endTime: null },
      Saturday: { selected: false, startTime: null, endTime: null },
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number | string>) => {
    const { name, value } = event.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
    setStatus(value === 'none');
  };

  const handleDayChange = (day: string) => {
    setAppointment(prev => ({
      ...prev,
      selectedDays: {
        ...prev.selectedDays,
        [day]: {
          ...prev.selectedDays[day],
          selected: !prev.selectedDays[day].selected,
        },
      },
    }));
  };

  const handleTimeChange = (day: string, type: 'start' | 'end', newValue: Dayjs | null) => {
    setAppointment(prev => ({
      ...prev,
      selectedDays: {
        ...prev.selectedDays,
        [day]: {
          ...prev.selectedDays[day],
          [type === 'start' ? 'startTime' : 'endTime']: newValue,
        },
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Appointment data:', appointment);
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
            <MenuItem value="biweekly">ทุกสองสัปดาห์</MenuItem> {/* Added biweekly option */}
          </Select>
        </FormControl>

        {status && (
          <div className="space-y-2">
            <TimePicker
              label="เวลาเริ่มต้น"
              value={appointment.startTime}
              onChange={(newValue) => setAppointment(prev => ({ ...prev, startTime: newValue }))}
            />
            <TimePicker
              label="เวลาสิ้นสุด"
              value={appointment.endTime}
              onChange={(newValue) => setAppointment(prev => ({ ...prev, endTime: newValue }))}
            />
          </div>
        )}

        {appointment.recurrence !== 'none' && (
          <div>
            <h4>เลือกวัน:</h4>
            {Object.keys(appointment.selectedDays).map(day => (
              <div key={day}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={appointment.selectedDays[day].selected}
                      onChange={() => handleDayChange(day)}
                      name={day}
                    />
                  }
                  label={day}
                />
                {appointment.selectedDays[day].selected && (
                  <div className="space-y-2">
                    <TimePicker
                      label="เวลาเริ่มต้น"
                      value={appointment.selectedDays[day].startTime}
                      onChange={(newValue) => handleTimeChange(day, 'start', newValue)}
                    />
                    <TimePicker
                      label="เวลาสิ้นสุด"
                      value={appointment.selectedDays[day].endTime}
                      onChange={(newValue) => handleTimeChange(day, 'end', newValue)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button type="submit" variant="contained" color="primary">
          สร้างการนัดหมาย
        </Button>
      </form>
    </LocalizationProvider>
  );
}