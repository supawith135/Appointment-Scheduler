import React, { useEffect, useState } from 'react';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import { GetBookingByStudentID } from '../../services/https/student/booking';
import { BookingsInterface } from '../../interfaces/IBookings';

const StudentHistoryTable: React.FC = () => {
    const [bookingsData, setBookingsData] = useState<BookingsInterface[]>([]);

    // Function to get the icon, color, and description based on status_id
    const getStatusIconAndColor = (statusId: number): { icon: JSX.Element; color: string; description: string } => {
        switch (statusId) {
            case 1:
                return { icon: <AccessTimeIcon />, color: 'orange', description: 'รอการเข้าพบ' };
            case 2:
                return { icon: <CheckIcon />, color: 'green', description: 'เข้าพบสำเร็จ' };
            case 3:
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

    // Handle view details
    const handleViewDetails = (id: number) => {
        console.log(`View details for appointment ID: ${id}`);
        // Implement your view details logic here
    };

    // Handle delete action
    const handleDelete = (id: number) => {
        console.log(`Delete appointment ID: ${id}`);
        // Implement your delete logic here
    };

    // Define the columns with custom actions
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'fullName',
            headerName: 'Full Name',
            description: 'Name of the student',
            sortable: false,
            width: 200,
        },
        {
            field: 'reasons',
            headerName: 'Reasons',
            width: 300,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 80,
            renderCell: (params) => {
                const { icon, color, description } = getStatusIconAndColor(params.value as number);
                return (
                    <Tooltip title={description} arrow>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color, marginTop: '16px' }}>
                            {icon}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
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
                    <Tooltip title="Delete" arrow>
                        <DeleteIcon
                            color="error"
                            style={{ cursor: 'pointer', marginTop: '16px' }}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white">
            <h2 className="text-lg font-semibold mb-4">Booking History</h2>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={bookingsData.map((booking) => ({
                        id: booking.ID ?? 0,
                        fullName: booking.user?.full_name || 'Unknown',
                        reasons: booking.title || 'No title',
                        status: booking.status_id || 0, // Use status_id instead of status
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
            </div>
        </div>
    );
};

export default StudentHistoryTable;
