import React from 'react';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

const rows = [
    { id: 1, firstName: 'Aek', lastName: 'Chai', reasons: 'Discussion about project', status: 'รอการเข้าพบ' },
    { id: 2, firstName: 'Somchai', lastName: 'Sukhum', reasons: 'Course counseling', status: 'รอการเข้าพบ' },
    { id: 3, firstName: 'Anan', lastName: 'Praphat', reasons: 'Exam review', status: 'ไม่ได้เข้าพบ' },
    { id: 4, firstName: 'Nicha', lastName: 'Wong', reasons: 'Career advice', status: 'เข้าพบสำเร็จ' },
    { id: 5, firstName: 'Pim', lastName: 'Sawatdee', reasons: 'Personal issues', status: 'เข้าพบสำเร็จ' },
    { id: 6, firstName: 'Kanya', lastName: 'Kiat', reasons: 'Research assistance', status: 'เข้าพบสำเร็จ' },
    { id: 7, firstName: 'Lek', lastName: 'Thong', reasons: 'Scholarship inquiry', status: 'เข้าพบสำเร็จ' },
];

const StudentListTable: React.FC = () => {
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
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 200,
            valueGetter: (_, rows) => `${rows.firstName || ''} ${rows.lastName || ''}`,
        },
        { field: 'reasons', headerName: 'Reasons', width: 300 },
        {
            field: 'status',
            headerName: 'Status',
            width: 80,
            renderCell: (params) => {
                const { icon, color, description } = getStatusIconAndColor(params.value as string);
                return (
                    <Tooltip title={description} arrow>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color , marginTop: '16px'}}>
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
                            onClick={() => handleViewDetails(params.row.id)} // Added onClick for view details
                        />
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                        <DeleteIcon
                            color="error"
                            style={{ cursor: 'pointer', marginTop: '16px' }}
                            onClick={() => handleDelete(params.row.id)} // Added onClick for delete action
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white">
            {/* <h2 className="text-lg font-semibold mb-4">Appointment History</h2> */}
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
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

export default StudentListTable;
