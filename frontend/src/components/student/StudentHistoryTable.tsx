import React, { useEffect, useState } from 'react';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import { GetBookingByStudentID } from '../../services/https/student/booking';
import { BookingsInterface } from '../../interfaces/IBookings';
import BookingDetailsStudentModel from '../modal/BookingDetailsStudentModel';

const StudentHistoryTable: React.FC = () => {
    const [bookingsData, setBookingsData] = useState<BookingsInterface[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState<any>(null); // Replace 'any' with a more specific type if possible
    // ฟังก์ชันเพื่อแปลงเวลาให้เป็นรูปแบบ "HH:MM"
    const formatTime = (time: string | undefined) => {
        if (!time) return '';
        const date = new Date(time);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const theme = createTheme({
        typography: {
            fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
        },
    });
    // Function to get the icon, color, and description based on status_id
    const getStatusIconAndColor = (status: string): { icon: JSX.Element; color: string; description: string } => {
        switch (status) {
            case 'รอการเข้าพบ':
                return { icon: <AccessTimeIcon />, color: 'orange', description: 'รอการเข้าพบ' };
            case 'เข้าพบสำเร็จ':
                return { icon: <CheckIcon />, color: 'green', description: 'เข้าพบสำเร็จ' };
            case 'ไม่ได้เข้าพบ':
                return { icon: <ClearIcon />, color: 'red', description: 'ไม่ได้เข้าพบ' };
            default:
                return { icon: <AccessTimeIcon />, color: 'gray', description: 'Unknown' };
        }
    };

    const getBookingByStudentID = async (id: string) => {
        try {
            const res = await GetBookingByStudentID(id);
            if (res.status === 200) {
                setBookingsData(res.data.data); // Access the correct data field
                console.log("GetBookingByStudent data:", res.data.data);
            } else {
                console.error("Expected an array but got:", res.data);
            }
        } catch (error) {
            console.error("Error getting booking by ID:", error);
        }
    };

    useEffect(() => {
        const id = String(localStorage.getItem("id"));
        if (id) {
            getBookingByStudentID(id);
        }
    }, []);

    // Update handleViewDetails to open the modal with selected booking details
    const handleViewDetails = (id: number) => {
        const booking = bookingsData.find(b => b.ID === id);
        if (booking) {
            setSelectedBooking(booking);
            setIsModalOpen(true);
        }
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    // // Handle delete action
    // const handleDelete = (id: number) => {
    //     console.log(`Delete appointment ID: ${id}`);
    //     // Implement your delete logic here
    // };
    // // Handle cell click
    // const handleCellClick = (params: any) => {
    //     if (params.field === 'fullName') {
    //         setTimeout(() => window.location.reload(), 2000);
    //     }
    // };
    // Define the columns with custom actions
    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 30,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ
        },
        // {
        //     field: 'fullName',
        //     headerName: 'Full Name',
        //     description: 'Name of the student',
        //     sortable: false,
        //     width: 120,
        // },

        {
            field: 'advisorName',
            headerName: 'ชื่ออาจารย์',
            description: 'รายชื่ออาจารย์',
            sortable: false,
            width : 120,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ
        },
        {
            field: 'reasons',
            headerName: 'เหตุผลเข้าพบ',
            description: 'รายละเอียดเหตุผลเข้าพบ',
            width : 150,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ

        },
        {
            field: 'location',
            headerName: 'สถานที่นัดหมาย',
            description: 'สถานที่เข้าพบอาจารย์',
            width : 120,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ

        },
        {
            field: 'date',
            headerName: 'วันที่เข้าพบอาจารย์',
            description: 'วันที่เข้าพบอาจารย์',
            sortable: false,
            width : 150,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ
            renderCell: (params) => {
                // Convert slot_date to readable date format
                const date = new Date(params.value);
                return date.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        {
            field: 'timeRange',
            headerName: 'ช่วงเวลาพบ',
            description: 'ช่วงเวลาเข้าพบอาจารย์',
            width : 130,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ
            valueGetter: (_, row) => {
                const startTime = row?.slot_start_time;
                const endTime = row?.slot_end_time;
                return `${formatTime(startTime)} - ${formatTime(endTime)} น.`;
            }
        },
        {
            field: 'comment',
            headerName: 'ความคิดเห็นอาจารย์',
            description: 'รายละเอียดความคิดเห็นของอาจารย์',
            width : 170,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ

        },
        {
            field: 'status',
            headerName: 'สถานะ',
            description: 'สถานะเข้าพบ',
            width : 80,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ
            renderCell: (params) => {
                const { icon, color, description } = getStatusIconAndColor(params.value as string);
                return (
                    <div style={{ display: 'flex' }}>
                        <Tooltip title={description} arrow>
                            <div style={{ cursor: 'pointer', color }}>
                                {icon}
                            </div>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            description: 'Actions!',
            width : 100,
            sortable: false,
            headerClassName: 'font-bold text-lg', // ขนาดและความหนาของหัวข้อ
            renderCell: (params) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Tooltip title="View Details" arrow>
                        <RemoveRedEyeOutlinedIcon
                            color="primary"
                            style={{ cursor: 'pointer', marginTop: '16px' }}
                            onClick={() => handleViewDetails(params.row.id)}
                        />
                    </Tooltip>
                    {/* <Tooltip title="Delete" arrow>
                        <DeleteIcon
                            color="error"
                            style={{ cursor: 'pointer', marginTop: '16px' }}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </Tooltip> */}
                </div>
            ),
        },
    ];


    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white ">
            <h2 className="text-lg font-semibold mb-4">Booking History</h2>
            <div style={{ height: 400, width: '100%' }}>
                <ThemeProvider theme={theme}>
                    <DataGrid
                        rows={bookingsData.map((booking) => ({
                            id: booking.ID ?? 0,
                            advisorName: booking.user?.advisor?.full_name || 'Unknown',
                            reasons: booking.reason || 'No title',
                            location: booking.time_slot?.location || 'No Location',
                            comment: booking.comment || 'ยังไม่แสดงความคิดเห็น',
                            date: booking?.time_slot?.slot_date,
                            slot_start_time: booking.time_slot?.slot_start_time || '',
                            slot_end_time: booking.time_slot?.slot_end_time || '',
                            status: booking.status?.status || 0,
                        }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-cell': {
                                fontFamily: 'Noto Sans, Noto Sans Thai',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#e0f7fa',
                            },
                            '& .MuiDataGrid-columnSeparator--sideRight': {
                                display: 'none',
                            },
                        }}
                    />
                </ThemeProvider>

            </div>
            <BookingDetailsStudentModel
                open={isModalOpen}
                onClose={handleCloseModal}
                bookingDetails={selectedBooking}
            />
        </div>
    );
};

export default StudentHistoryTable;
