import React, { useState } from 'react';
import {
    Modal, Box, Typography, IconButton, Button, TextField,
    Fade, Divider, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BookingsInterface } from '../../interfaces/IBookings';
import { UpdateBookingStudentById } from '../../services/https/teacher/listBookingStudent';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import {  CheckCircle ,XCircle } from 'react-feather'; // เพิ่ม import icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CheckCircle as Clock, Cancel } from '@mui/icons-material';
interface BookingDetailsModalProps {
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

const formatThaiDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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
    const [comment, setComment] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleSubmit = async () => {
        const id = String(bookingDetails.ID);
        const updatedValues: BookingsInterface = {
            ...bookingDetails,
            comment,
        };

        toast.promise(
            UpdateBookingStudentById(id, updatedValues),
            {
                loading: 'กำลังบันทึกข้อมูล...',
                success: (res) => {
                    if (res.status === 200) {
                        setTimeout(() => window.location.reload(), 2000);
                        return (
                            <div style={{ display: 'flex', alignItems: 'center',}}>
                                <CheckCircle color="green" size={20} style={{ marginRight: '8px'}} />
                                <span>บันทึกข้อมูลสำเร็จ</span>
                            </div>
                        );
                    } else {
                        throw new Error('Unexpected response status');
                    }
                },
                error: (_) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <XCircle color="red" size={20} style={{ marginRight: '8px' }} />
                        <span>เกิดข้อผิดพลาดในการบันทึกข้อมูล</span>
                    </div>
                ),
            },
            {
                style: {
                    minWidth: '250px',
                    backgroundColor: '#333',
                    color: '#fff',
                },
                success: {
                    duration: 5000,
                    icon: '🎉',
                },
                error: {
                    duration: 5000,
                    icon: '❌',
                },
            }
        );
    };
    React.useEffect(() => {
        if (bookingDetails) {
            setComment(bookingDetails.comment || '');
            setIsEditing(bookingDetails.comment ? false : true); // ถ้า comment มีอยู่ ให้ set isEditing เป็น false
        }
    }, [bookingDetails]);

    const handleEdit = () => {
        setIsEditing(true);
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

    const slotDate = bookingDetails?.time_slot?.slot_date;
    const slotStartTime = bookingDetails?.time_slot?.slot_start_time;
    const slotEndTime = bookingDetails?.time_slot?.slot_end_time;

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
                            width: 450,
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

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>รหัสนักศึกษา:</strong> {bookingDetails?.user?.user_name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>ชื่อ-สกุล:</strong> {bookingDetails?.user?.full_name}
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>สถานที่นัดหมาย:</strong> {bookingDetails?.time_slot?.location}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong>เหตุผลที่เข้าพบ:</strong> {bookingDetails?.reason}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" sx={{ mb: 1, color: 'black' }}>
                                <strong className='text-black'>สถานะการเข้าพบ :</strong>{statusProps.icon} {bookingDetails?.status?.status}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 2, mb: 1 }}>
                                ความคิดเห็นอาจารย์
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: !isEditing, // ใช้สถานะ isEditing เพื่อควบคุมความสามารถในการแก้ไข
                                }}
                            />

                            {!isEditing && bookingDetails?.status?.status && (
                                <Button variant="outlined" onClick={handleEdit}>
                                    แก้ไขข้อความ
                                </Button>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button variant="outlined" onClick={onClose} color="error">
                                    ยกเลิก
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSubmit}
                                    sx={{color : 'white'}}
                                >
                                    แสดงความคิดเห็น
                                </Button>
                            </Box>
                            {/* </Paper> */}
                        </motion.div>
                    </Box>
                </Fade>
            </Modal>
            <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider>
    );
};

export default BookingDetailsModal;