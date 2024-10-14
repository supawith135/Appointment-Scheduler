import React from 'react';
import {
    Modal, Box, Typography, IconButton, Button,
    Fade, Divider, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BookingsInterface } from '../../interfaces/IBookings';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { CheckCircle as Clock, Cancel } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface ModalTeacherStudentDeailProps {
    open: boolean;
    onClose: () => void;
    bookingDetails: BookingsInterface;
}


const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
    palette: {
        primary: {
            main: '#800020',
        },
        secondary: {
            main: '#4caf50',
        },
    },
});
const formatThaiDate = (dateInput: string | Date | undefined) => {
    if (!dateInput) return '';

    // Convert the input to a Date object
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    // If the year is less than a reasonable value (e.g., 1900), return an empty string
    if (date.getFullYear() < 1900) return '';

    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
// const formatThaiDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//     };
//     const date = new Date(dateString);
//     return date.toLocaleDateString('th-TH', options);
// };

const formatTime = (time: string | undefined) => {
        if (!time) return '';
        
        // Parse the date string and adjust for the timezone offset
        const date = new Date(time);
        const offsetMinutes = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() + offsetMinutes * 60000);
    
        return adjustedDate.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

const ModalTeacherStudentDeail: React.FC<ModalTeacherStudentDeailProps> = ({ open, onClose, bookingDetails }) => {


    const handleCancelBooking = () => {
        onClose(); // เรียก onClose เพื่อปิด modal
    };
    const getStatusProps = (status: string) => {
        switch (status) {
            case 'รอการเข้าพบ':
                return { icon: <AccessTimeIcon color="warning" /> };
            case 'เข้าพบสำเร็จ':
                return { icon: <Clock color="success" /> };
            case 'ไม่ได้เข้าพบ':
                return { icon: <Cancel color="error" /> };
            default:
                return { icon: null };
        }
    };
    const statusProps = getStatusProps(bookingDetails?.status?.status || "");
    const canCancelBooking = bookingDetails?.status?.status === 'รอการเข้าพบ';
    const slotDate =   bookingDetails?.time_slot?.slot_date || bookingDetails?.CreatedAt;
    const slotStartTime =   bookingDetails?.time_slot?.slot_start_time || bookingDetails?.CreatedAt;
    const slotEndTime =   bookingDetails?.time_slot?.slot_end_time || bookingDetails?.CreatedAt;

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={open}
                onClose={onClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 380,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            borderRadius: 4,
                            p: 4,
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}> */}
                            <IconButton
                                onClick={onClose}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
                                {bookingDetails?.time_slot?.title}
                            </Typography>

                            <Chip
                                label={`${formatThaiDate(slotDate?.toString() || '')} ${formatTime(slotStartTime?.toString() || '')} - ${formatTime(slotEndTime?.toString() || '')} น.`}
                                color="primary"
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>อาจารย์ :</strong>
                                {(bookingDetails?.time_slot?.user?.position?.position_name && bookingDetails?.time_slot?.user?.full_name)
                                    ? `${bookingDetails?.time_slot?.user?.position?.position_name} ${bookingDetails?.time_slot?.user?.full_name}`
                                    : `${bookingDetails?.created_by?.position?.position_name} ${bookingDetails?.created_by?.full_name}`}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>สถานที่นัดหมาย :</strong> {bookingDetails?.time_slot?.location || bookingDetails?.location}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>ความคิดเห็นอาจารย์:</strong> {bookingDetails?.comment || "ยังไม่แสดงความคิดเห็น"}
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>รหัสประจำตัว:</strong> {bookingDetails?.user?.user_name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>ชื่อนักศึกษา:</strong> {bookingDetails?.user?.full_name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>เหตุผลที่เข้าพบ:</strong> {bookingDetails?.reason}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong className='text-black'>สถานะการเข้าพบ :</strong>{statusProps.icon} {bookingDetails?.status?.status}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            {/* <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 2, mb: 1 }}>
                                ความคิดเห็นอาจารย์ :
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {bookingDetails?.comment || "ยังไม่แสดงความคิดเห็น"}
                            </Typography> */}


                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancelBooking}
                                    color="error"
                                    disabled={!canCancelBooking} // Disable button if not allowed to cancel
                                >
                                    ปิด
                                </Button>

                            </Box>
                            {/* </Paper> */}
                        </motion.div>
                    </Box>
                </Fade>
            </Modal>
            <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
    );
};

export default ModalTeacherStudentDeail;