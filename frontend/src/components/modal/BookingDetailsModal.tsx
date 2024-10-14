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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, XCircle } from 'react-feather'; // เพิ่ม import icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CheckCircle as Clock, Cancel } from '@mui/icons-material';
interface BookingDetailsModalProps {
    open: boolean;
    onClose: () => void;
    bookingDetails: BookingsInterface;
    onUpdateSuccess: () => void;
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

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ open, onClose, bookingDetails, onUpdateSuccess }) => {
    const [comment, setComment] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!comment.trim()) return; // Prevent submitting empty comments

        const id = String(bookingDetails.ID);
        const updatedValues: BookingsInterface = {
            ...bookingDetails,
            comment,
        };
        try {
            const res = await UpdateBookingStudentById(id, updatedValues);
            if (res.status === 200) {
                toast.success(res.message || 'บันทึกข้อมูลสำเร็จ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                onUpdateSuccess();
                setIsEditing(false); // Exit editing mode after successful submission
                onClose();
            }
        } catch (error: any) {
            const errorMessage = error.res?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };


    React.useEffect(() => {
        if (bookingDetails) {
            setComment(bookingDetails.comment || '');
            setIsEditing(!bookingDetails.comment); // Start in editing mode if there's no comment
        }
    }, [bookingDetails]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
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

    const slotDate =   bookingDetails?.time_slot?.slot_date || bookingDetails?.CreatedAt;
    const slotStartTime =   bookingDetails?.time_slot?.slot_start_time || bookingDetails?.CreatedAt;
    const slotEndTime =   bookingDetails?.time_slot?.slot_end_time || bookingDetails?.CreatedAt;

    return (
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={handleClose} closeAfterTransition>
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
                                <strong>สถานที่นัดหมาย:</strong> {bookingDetails?.time_slot?.location || bookingDetails?.location}
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
                                onChange={handleCommentChange}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: !isEditing,
                                }}
                            />

                            {!isEditing && comment.trim() && (
                                <Button variant="outlined" onClick={handleEdit}>
                                    แก้ไขข้อความ
                                </Button>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button variant="outlined" onClick={handleClose} color="error">
                                    ยกเลิก
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSubmit}
                                    sx={{ color: 'white' }}
                                    disabled={!comment.trim() || !isEditing}
                                >
                                    แสดงความคิดเห็น
                                </Button>
                            </Box>
                            {/* </Paper> */}
                        </motion.div>
                    </Box>
                </Fade>
            </Modal>
            <ToastContainer />
        </ThemeProvider>
    );
};

export default BookingDetailsModal;