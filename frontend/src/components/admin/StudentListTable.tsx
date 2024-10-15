import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { GetStudentsList, DeleteStudentById } from '../../services/https/admin/listUsers';
import { UsersInterface } from '../../interfaces/IUsers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // อย่าลืม import CSS ของ react-toastify

const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
});

const StudentListTable: React.FC = () => {
    const [studentData, setStudentData] = React.useState<UsersInterface[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

    const getStudentsList = async () => {
        try {
            const res = await GetStudentsList();
            if (res.status === 200) {
                setStudentData(res.data.data);
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

    const handleOpenDialog = (id: number) => {
        setSelectedStudentId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudentId(null);
    };

    const handleDelete = async () => {
        if (selectedStudentId) {
            try {
                const id = String(selectedStudentId);
                const res = await DeleteStudentById(id); // เรียกใช้งานฟังก์ชันลบ
                if(res.status == 200){
                    setStudentData((prevData) => prevData.filter(student => String(student.ID) !== id));
                }
                // แจ้งเตือนเมื่อการลบสำเร็จ
                toast.success('ลบข้อมูลเรียบร้อยแล้ว');
                // เรียกใช้งาน getStudentsList เพื่อรีเฟรชข้อมูล
                await getStudentsList();

                handleCloseDialog();
            } catch (error) {
                console.error('Error deleting student:', error);
                toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'user_name',
            headerName: 'รหัสประจำตัว',
            width: 120,
        },
        {
            field: 'full_name',
            headerName: 'ชื่อ',
            width: 200,
        },
        {
            field: 'advisor',
            headerName: 'อาจารย์ที่ปรึกษา',
            width: 280,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenDialog(params.row.id)}
                >
                    ลบ
                </Button>
            ),
        },
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
                            advisor: `${student.advisor?.position?.position_name} ${student.advisor?.full_name}` || 'ยังไม่ได้เลือก',
                        }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 15]}
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

                {/* Confirmation Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>ยืนยันการลบ</DialogTitle>
                    <DialogContent>
                        คุณต้องการลบข้อมูลนี้หรือไม่?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            ยกเลิก
                        </Button>
                        <Button onClick={handleDelete} color="error">
                            ลบ
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Toast notifications */}
                <ToastContainer />
            </ThemeProvider>
        </div>
    );
};

export default StudentListTable;
