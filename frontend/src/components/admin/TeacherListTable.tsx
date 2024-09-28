import React from 'react';
// import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import Tooltip from '@mui/material/Tooltip';
import { GetTeachersList } from '../../services/https/admin/listUsers';
import { UsersInterface } from '../../interfaces/IUsers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
});

const TeacherListTable: React.FC = () => {
    const [teacherData, setTeacherData] = React.useState<UsersInterface[]>([]);

    const getTeachersList = async () => {
        try {
            const res = await GetTeachersList();
            if (res.status === 200) {
                setTeacherData(res.data.data);
                console.log("StudentData: ", res.data);
            } else {
                console.error('Unexpected response:', res);
            }
        } catch (error) {
            console.error('Error fetching students:', error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    React.useEffect(() => {
        getTeachersList();
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
            width: 250,
            headerClassName: 'font-bold text-xl',
        },
        {
            field: 'location',
            headerName: 'ที่อยู่อาจารย์',
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
                        rows={teacherData.map((teacherData) => ({
                            id: teacherData.ID ?? 0,
                            user_name: teacherData.user_name || 'ไม่พบรหัสประจำตัว',
                            full_name: `${teacherData.position?.position_name} ${teacherData.full_name}` || 'ไม่พบรายชื่อ',
                            location: teacherData.location || 'ยังไม่ได้ใส่ที่อยู่'
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

export default TeacherListTable;
