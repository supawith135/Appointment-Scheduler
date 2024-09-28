import React from 'react';
// import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GetStudentsList } from '../../services/https/admin/listUsers';
import { UsersInterface } from '../../interfaces/IUsers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
});

const StudentListTable: React.FC = () => {
    const [studentData, setStudentData] = React.useState<UsersInterface[]>([]);

    const getStudentsList = async () => {
        try {
            const res = await GetStudentsList();
            if (res.status === 200) {
                setStudentData(res.data.data);
                console.log("StudentData: ", res.data);
            } else {
                console.error('Unexpected response:', res);
            }
        } catch (error) {
            console.error('Error fetching students:', error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    React.useEffect(() => {
        getStudentsList();
    }, []);

    // const handleViewDetails = (id: number) => {
    //     console.log(`View details for student ID: ${id}`);
    // };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'user_name',
            headerName: 'รหัสประจำตัว',
            width: 120,
            headerClassName: 'font-bold text-xl',
        },
        {
            field: 'full_name',
            headerName: 'ชื่อ',
            width: 200,
            headerClassName: 'font-bold text-xl',
        },
        {
            field: 'advisor',
            headerName: 'อาจารย์ที่ปรึกษา',
            width: 200,
            headerClassName: 'font-bold text-xl',
        },
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     width: 150,
        //     renderCell: (params) => (
        //         <div style={{ display: 'flex', gap: '8px' }}>
        //             <Tooltip title="View Details" arrow>
        //                 <RemoveRedEyeOutlinedIcon
        //                     color="primary"
        //                     style={{ cursor: 'pointer', marginTop: '16px' }}
        //                     onClick={() => handleViewDetails(params.row.id)}
        //                 />
        //             </Tooltip>
        //         </div>
        //     ),
        // },
    ];

    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white">
            <ThemeProvider theme={theme}>
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={studentData.map((student) => ({
                            id: student.ID ?? 0,
                            user_name: student.user_name || 'ไม่พบรหัสประจำตัว',
                            full_name: student.full_name || 'ไม่พบรายชื่อ',
                            advisor: student.advisor?.full_name || 'ยังไม่ได้เลือก',
                        }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 20]}
                        checkboxSelection
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
                </div>
            </ThemeProvider>
        </div>
    );
};

export default StudentListTable;
