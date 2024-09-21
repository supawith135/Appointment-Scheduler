import React from 'react';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
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

const TeacherHistoryTable: React.FC = () => {
    const navigate = useNavigate();
    const [bookingsData, setBookingsData] = React.useState<BookingsInterface[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState<any>(null); // Replace 'any' with a more specific type if possible
    // Function to get the icon, color, and description based on status
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

    
    const formatTime = (time: string | undefined) => {
        if (!time) return '';
        const date = new Date(time);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getBookingStudentListByAdvisorID = async (id: string) => {
        try {
            const res = await GetBookingStudentListByAdvisorID(id);
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

    React.useEffect(() => {
        const id = String(localStorage.getItem("id"));
        if (id) {
            getBookingStudentListByAdvisorID(id);
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

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    // Handle delete action
    const handleDelete = (id: number) => {
        console.log(`Delete appointment ID: ${id}`);
        // Implement your delete logic here
    };

    // Handle cell click
    const handleCellClick = (params: any) => {
        if (params.field === 'fullName') {
            navigate(`/Teacher/StudentDetails/${params.row.id}`);
        }
    };

    // Define the columns with custom actions
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 30 },
        {
            field: 'student_id',
            headerName: 'Student ID',
            description: 'Name of the student',
            sortable: false,
            width: 120,
        },

        {
            field: 'student_name',
            headerName: 'Student Name',
            description: 'Name of the student',
            sortable: false,
            width: 120,
        },


        {
            field: 'reasons',
            headerName: 'Reasons',
            description: 'Reasons',
            width: 150,

        },
        {
            field: 'location',
            headerName: 'Location',
            description: 'Location',
            width: 100,

        },
        {
            field: 'date',
            headerName: 'Date',
            description: 'Date of the appointment',
            sortable: false,
            width: 120,
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
            width: 115,
            valueGetter: (value, row) => {
                const startTime = row?.slot_start_time;
                const endTime = row?.slot_end_time;
                return `${formatTime(startTime)} - ${formatTime(endTime)} น.`;
            }
        },
        {
            field: 'comment',
            headerName: 'ความคิดเห็นอาจารย์',
            description: 'Location',
            width: 200,

        },
        {
            field: 'status',
            headerName: 'Status',
            width: 60,

            renderCell: (params) => {
                const { icon, color, description } = getStatusIconAndColor(params.value as string);
                return (
                    <Tooltip title={description} arrow>
                        <div style={{ display: 'flex', alignItems: 'center', color, marginTop: '16px' }}>
                            {icon}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
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
        <div className="border rounded-lg shadow-lg p-4 bg-white">
            <h2 className="text-lg font-semibold mb-4">Appointment History</h2>
            <div style={{ height: 400, width: '100%' }}>
                <DataGridPremium
                    rows={bookingsData.map((booking) => ({
                        id: booking.ID ?? 0,
                        student_id: booking.user?.user_name || 'Unknown',
                        student_name: booking.user?.full_name || 'Unknown',
                        reasons: booking.reason || 'No title',
                        location: booking.time_slot?.location || 'No Location',
                        comment: booking.comment || 'ยังไม่แสดงความคิดเห็น',
                        date: booking?.time_slot?.slot_date,
                        slot_start_time: booking.time_slot?.slot_start_time || '',
                        slot_end_time: booking.time_slot?.slot_end_time || '',
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
            </div>
            <BookingDetailsModal
                open={isModalOpen}
                onClose={handleCloseModal}
                bookingDetails={selectedBooking}
            />
        </div>
    );
};

export default TeacherHistoryTable;
