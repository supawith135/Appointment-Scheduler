import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BookingsInterface } from '../../interfaces/IBookings';
import TextField from '@mui/material/TextField';
import { UpdateBookingStudentById } from '../../services/https/teacher/listBookingStudent';
import { Alert, Snackbar } from '@mui/material';
interface BookingDetailsModalProps {
    open: boolean;
    onClose: () => void;
    bookingDetails: BookingsInterface; // Replace 'any' with a more specific type if possible
}

const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
});

const formatThaiDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // weekday: 'long',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', options);
};

const formatTime = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };
    const time = new Date(timeString);
    return time.toLocaleTimeString('th-TH', options);
};

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ open, onClose, bookingDetails }) => {
    const [alert, setAlert] = React.useState<{ message: string; severity: 'success' | 'error' | undefined } | null>(null);
    const [comment, setComment] = React.useState<string>(bookingDetails?.comment || '');

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };

    const handleSubmit = async () => {
        const id = String(bookingDetails.ID);
        const updatedValues: BookingsInterface = {
            ...bookingDetails,
            status_id: 2,
            comment,
        };
        console.log('Payload being sent to API:', updatedValues);  // Log to verify
    
        try {
            const res = await UpdateBookingStudentById(id, updatedValues);
            if (res.status === 200) {
                console.log("Update successful:", res);
                setAlert({ message: 'Booking updated successfully', severity: 'success' });
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            setAlert({ message: 'Failed to update booking', severity: 'error' });
        }
    };


    const slotDate = bookingDetails?.time_slot?.slot_date;
    const slotStartTime = bookingDetails?.time_slot?.slot_start_time;
    const slotEndTime = bookingDetails?.time_slot?.slot_end_time;

    return (
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontSize: '1.8rem', color: '#800020', fontWeight: 'bold', marginBottom: 1 }}>{bookingDetails?.time_slot?.title}</Typography>
                        {/* <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton> */}
                    </div>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'black', fontWeight: 'bold' }}>
                        {slotDate ? formatThaiDate(slotDate.toString()) : 'วันที่ไม่ระบุ'}
                        {slotDate && slotStartTime && slotEndTime ? ' : ' : ''} {/* แสดง - เฉพาะเมื่อมีเวลาทั้งสอง */}
                        {slotStartTime ? formatTime(slotStartTime.toString()) : 'เวลาเริ่มไม่ระบุ'}
                        {slotStartTime && slotEndTime ? ' - ' : ''} {/* แสดง - เฉพาะเมื่อมีเวลาทั้งสอง */}
                        {slotEndTime ? formatTime(slotEndTime.toString()) : 'เวลาสิ้นสุดไม่ระบุ'}
                        {slotStartTime && slotEndTime ? ' น. ' : ''} {/* แสดง - เฉพาะเมื่อมีเวลาทั้งสอง */}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px', color: 'black' }}>
                        <span style={{ fontWeight: 'bold' }}>รหัสนักศึกษา :</span> {bookingDetails?.user?.user_name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px', color: 'black' }}>
                        <span style={{ fontWeight: 'bold' }}>ชื่อ-สกุล :</span>{bookingDetails?.user?.full_name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px', color: 'black' }}>
                        <span style={{ fontWeight: 'bold' }}>สถานะการเข้าพบ :</span> {bookingDetails?.status?.status}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px', color: 'black' }}>
                        <span style={{ fontWeight: 'bold' }}>สถานที่นัดหมาย :</span> {bookingDetails?.time_slot?.location}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px', color: 'black' }}>
                        <span style={{ fontWeight: 'bold' }}>เหตุผลที่เข้าพบ :</span> {bookingDetails?.reason}
                    </Typography>
                    
                    <div className='text-ENGi-Red text-[20px] mt-2 text-blod'>
                        ความคิดเห็นอาจารย์
                    </div>
                    <TextField
                        sx={{
                            width: 300,
                            '& .MuiInput-underline:before': { borderBottomColor: '#800020' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#800020' },
                            '& .MuiInputBase-root': { color: '#800020' },
                        }}
                        id="standard-multiline-static"
                        multiline
                        rows={3}
                        value={comment} // ใช้ state comment
                        onChange={(e) => setComment(e.target.value)} // อัปเดตค่า comment เมื่อมีการแก้ไข
                        variant="standard"
                    />
                    <div className='flex justify-end gap-4 mt-4 mr-2'>
                        <Button variant="text" onClick={onClose} sx={{ fontSize: '18px', color: 'red' }} > ยกเลิก </Button>
                        <Button variant="contained"
                            sx={{
                                fontSize: '18px',   // ปรับขนาดตัวอักษร
                                backgroundColor: 'green', // เปลี่ยนพื้นหลังเป็นสีเขียว
                                '&:hover': {
                                    backgroundColor: 'darkgreen' // เปลี่ยนพื้นหลังเมื่อ hover
                                }
                            }}
                            onClick={handleSubmit}
                        >
                            แสดงความคิดเห็น
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Snackbar open={!!alert} autoHideDuration={6000} onClose={() => setAlert(null)}>
                <Alert onClose={() => setAlert(null)} severity={alert?.severity}>
                    {alert?.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};
export default BookingDetailsModal;
