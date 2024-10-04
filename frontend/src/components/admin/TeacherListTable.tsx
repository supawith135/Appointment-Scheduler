import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { GetTeachersList, DeleteTeacherById } from '../../services/https/admin/listUsers';
import { UsersInterface } from '../../interfaces/IUsers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // อย่าลืม import CSS ของ react-toastify

const theme = createTheme({
    typography: {
        fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
    },
});

const TeacherListTable: React.FC = () => {
    const [teacherData, setTeacherData] = React.useState<UsersInterface[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

    const getTeachersList = async () => {
        try {
            const res = await GetTeachersList();
            if (res.status === 200) {
                setTeacherData(res.data.data);
            } else {
                console.error('Unexpected response:', res);
            }
        } catch (error) {
            console.error('Error fetching Teachers:', error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    React.useEffect(() => {
        getTeachersList();
    }, []);

    const handleOpenDialog = (id: number) => {
        setSelectedTeacherId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTeacherId(null);
    };

    const handleDelete = async () => {
        if (selectedTeacherId) {
            try {
                const id = String(selectedTeacherId);
                const res = await DeleteTeacherById(id); // เรียกใช้งานฟังก์ชันลบ
                if(res.status == 200){
                    setTeacherData((prevData) => prevData.filter(teacher => String(teacher.ID) !== id));
                }
                
                // แจ้งเตือนเมื่อการลบสำเร็จ
                toast.success('ลบข้อมูลเรียบร้อยแล้ว', {
                    onClose: () => window.location.reload(), // Reload หน้าเมื่อแจ้งเตือนเสร็จแล้ว
                });

                handleCloseDialog();
            } catch (error) {
                console.error('Error deleting Teacher:', error);
                toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'position',
            headerName: 'ตำแหน่ง',
            width: 200,
        },
        {
            field: 'full_name',
            headerName: 'ชื่อ',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'อีเมล',
            width: 200,
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
                        rows={teacherData.map((teacher) => ({
                            id: teacher.ID ?? 0,
                            position: teacher.position?.position_name,
                            full_name: teacher.full_name || 'ไม่พบรายชื่อ',
                            email: teacher.email || 'ยังไม่ได้เลือก',
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

export default TeacherListTable;
