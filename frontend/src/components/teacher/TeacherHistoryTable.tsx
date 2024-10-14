import React from 'react';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { DataGridPremium, GridToolbarContainer, GridToolbarExport, GridColDef, GridCsvExportOptions } from '@mui/x-data-grid-premium';
import { BookingsInterface } from '../../interfaces/IBookings';
import { GetBookingStudentListByAdvisorID } from '../../services/https/teacher/listBookingStudent';
import BookingDetailsModal from '../modal/BookingDetailsModal';
function CustomToolbar() {
    const csvOptions: GridCsvExportOptions = {
        utf8WithBom: true, // Ensure UTF-8 with BOM for proper encoding in Excel
    };

    return (
        <GridToolbarContainer>
            <GridToolbarExport csvOptions={csvOptions} />
        </GridToolbarContainer>
    );
}
const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
});

const TeacherHistoryTable: React.FC = () => {
    const navigate = useNavigate();
    const [bookingsData, setBookingsData] = React.useState<BookingsInterface[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState<any>(null); // Replace 'any' with a more specific type if possible
    // Function to get the icon, color, and description based on status
    const [refreshKey, setRefreshKey] = React.useState(0); // Add this line
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

    const formatDay = (dateInput: string | Date | undefined) => {
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
    const getBookingStudentListByAdvisorID = async (id: string) => {
        try {
            const res = await GetBookingStudentListByAdvisorID(id);
            if (res.status === 200) {
                setBookingsData(res.data.data);
                console.log("GetBookingByStudent data:", res.data.data);
            } else {
                console.error("Expected an array but got:", res.data);
            }
        } catch (error) {
            console.error("Error getting booking by ID:", error);
        }
    };

    React.useEffect(() => {
        const id = String(localStorage.getItem("id"));
        if (id) {
            getBookingStudentListByAdvisorID(id);
        }
    }, [refreshKey]); // Add refreshKey as a dependency

    const handleUpdateSuccess = () => {
        setRefreshKey(oldKey => oldKey + 1); // Increment refreshKey to trigger useEffect
    };
    // Update handleViewDetails to open the modal with selected booking details
    const handleViewDetails = (id: number) => {
        const booking = bookingsData.find(b => b.ID === id);
        if (booking) {
            setSelectedBooking(booking);
            setIsModalOpen(true);
        }
    };
    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };


    // Handle delete action
    // const handleDelete = (id: number) => {
    //     console.log(`Delete appointment ID: ${id}`);
    //     // Implement your delete logic here
    // };

    // Handle cell click
    // const handleCellClick = (params: any) => {
    //     if (params.field === 'fullName') {
    //         navigate(`/Teacher/StudentDetails/${params.row.id}`);
    //     }
    // };
    const handleCellClick = (params: any) => {
        if (params.field === 'student_id' || params.field === 'student_name') {
            navigate(`/Teacher/StudentBookingDetails/${params.row.student_id}`); // Change to params.row.student_id or the desired property
        }
    };

    // Define the columns with custom actions
    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 30,
            headerClassName: 'font-bold text-xl', // ขนาดและความหนาของหัวข้อ
        },
        {
            field: 'student_id',
            headerName: 'รหัสนักศึกษา',
            description: 'รหัสนักศึกษา',
            sortable: false,
            width: 120,
            headerClassName: 'font-bold text-xl',
            renderCell: (params) => (
                <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'student_name',
            headerName: 'ชื่อนักศึกษา',
            description: 'รายชื่อนักศึกษา',
            sortable: false,
            width: 140,
            headerClassName: 'font-bold text-xl',
            renderCell: (params) => (
                <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'reasons',
            headerName: 'เหตุผลเข้าพบ',
            description: 'รายละเอียดเหตุผลเข้าพบ',
            width: 150,
            headerClassName: 'font-bold text-xl', // ขนาดและความหนาของหัวข้อ

        },
        {
            field: 'location',
            headerName: 'สถานที่นัดหมาย',
            description: 'สถานที่เข้าพบอาจารย์',
            width: 140,
            headerClassName: 'font-bold text-xl', // ขนาดและความหนาของหัวข้อ

        },
        {
            field: 'date',
            headerName: 'วันที่เข้าพบอาจารย์',
            description: 'วันที่เข้าพบอาจารย์',
            width: 150,
            headerClassName: 'font-bold text-xl',

        },
        {
            field: 'timeRange',
            headerName: 'ช่วงเวลาพบ',
            description: 'ช่วงเวลาเข้าพบอาจารย์',
            width: 130,
            headerClassName: 'font-bold text-xl',
            valueGetter: (_, row) => {
                const startTime = formatTime(row.slot_start_time || row.CreatedAt);
                const endTime = formatTime(row.slot_end_time || row.CreatedAt);
                if (!startTime && !endTime) return '';
                return `${startTime} - ${endTime} น.`;
            }
        },
        {
            field: 'comment',
            headerName: 'ความคิดเห็นอาจารย์',
            description: 'รายละเอียดความคิดเห็นของอาจารย์',
            width: 170,
            headerClassName: 'font-bold text-xl', // ขนาดและความหนาของหัวข้อ

        },
        {
            field: 'status',
            headerName: 'สถานะ',
            description: 'สถานะเข้าพบ',
            width: 100,
            headerClassName: 'font-bold text-xl', // ขนาดและความหนาของหัวข้อ

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
            sortable: false,
            width: 100,
            headerClassName: 'font-bold text-xl', // ขนาดและความหนาของหัวข้อ
            renderCell: (params) => (
                <div style={{ display: 'flex' }}>
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
        <div className="border rounded-lg shadow-lg p-4 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-black">Booking History</h2>
            <div style={{ height: 400, width: '100%' }}>
                <ThemeProvider theme={theme}>
                    <DataGridPremium
                        rows={bookingsData.map((booking) => ({
                            id: booking.ID ?? 0,
                            student_id: booking.user?.user_name || 'Unknown',
                            student_name: booking.user?.full_name || 'Unknown',
                            reasons: booking.reason || 'No title',
                            location: booking.time_slot?.location || booking.location || 'No Location',
                            comment: booking.comment || 'ยังไม่แสดงความคิดเห็น',
                            date: formatDay(booking?.time_slot?.slot_date) || formatDay(booking?.CreatedAt) || '',
                            slot_start_time: booking.time_slot?.slot_start_time || booking?.CreatedAt || '', // แสดง start_time หรือ CreatedAt
                            slot_end_time: booking.time_slot?.slot_end_time || booking?.CreatedAt || '', // แสดง end_time หรือ CreatedAt
                            status: booking.status?.status || "unknow",
                        }))}
                        columns={columns}
                        slots={{
                            toolbar: CustomToolbar,
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        onCellClick={handleCellClick}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                fontFamily: 'Noto Sans, Noto Sans Thai',
                                fontSize: '16px', // Increase font size here
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                                fontSize: '18px', // Increase header font size
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
            <BookingDetailsModal
                open={isModalOpen}
                onClose={handleCloseModal}
                bookingDetails={selectedBooking}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    );
};

export default TeacherHistoryTable;
